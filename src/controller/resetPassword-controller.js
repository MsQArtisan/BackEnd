const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const passwordResetToken = require('../models/resetToken');
const User = require('../models/artisan-model');

exports.ResetPassword = (req, res) => {
    if (!req.body.email) {
        return res.status(400).send({ message: 'You need to send email and password' });
    }
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).send({ message: false });
        }

        if (!user) {
            return res.status(400).json({ message: 'The user/email does not exist' });
        }
        var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
        resettoken.save(function (err) {
            if (err) {
                return res.status(500).send({ msg: err.message });
            }
            passwordResetToken.find({
                _userId: user._id,
                resettoken: { $ne: resettoken.resettoken }
            })
                .remove()
                .exec()


            res.status(200).json({ message: 'Reset Password successfully.' });

            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                port: 465,
                auth: {
                    user: 'msqintern0@gmail.com',
                    pass: 'msqassociates'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'msqintern0@gmail.com',
                subject: 'Ms.Q Artisan Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://localhost:4200/response-reset-password/' + resettoken.resettoken + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
            });
        })
    })
};

exports.ValidPasswordToken = (req, res) => {
    if (!req.body.resettoken) {
        return res
            .status(500)
            .json({ message: 'Token is required' });
    }
    passwordResetToken.findOne({ resettoken: req.body.resettoken }, (err, data) => {
        if (!data) {
            return res
                .status(409)
                .json({ message: 'Invalid URL Daw Cya' });
        }
        User.findOne({ _id: data._userId }).then(() => {
            res.status(200).json({ message: 'Token verified successfully.' });
        })
            .catch((err) => {
                console.log(err)
                return res.status(500).send({ msg: err.message });
            });
    })
};

exports.NewPassword = (req, res) => {
    passwordResetToken.findOne({ resettoken: req.body.resettoken }, function (err, userToken, next) {
        if (!userToken) {
            return res
                .status(409)
                .json({ message: 'Token has expired' });
        }
        User.findOne({ _id: userToken._userId }, function (err, userEmail, next) {
            if (!userEmail) {
                return res
                    .status(409)
                    .json({ message: 'User does not exist' });
            }
            return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                if (err) {
                    return res
                        .status(400)
                        .json({ message: 'Error hashing password' });
                }
                userEmail.password = hash;
                User.findByIdAndUpdate(userToken._userId, { password: userEmail.password },
                    function (err, data) {
                        if (err) {
                            return res
                                .status(400)
                                .json({ message: 'Password can not reset.' });
                        } else {
                            userToken.remove();
                            return res
                                .status(200)
                                .json({ message: 'Password reset successfully' });
                        }
                    });
            });

        });

    })
}



