var User = require('../models/artisan-model');
var Orders = require('../models/Bookings')
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var userTask = require('../models/taskOfEveryUsers')
var logsOfHistory = require('../models/logsHistory')
const multer = require('multer');
var loggedusers = []

function createToken(user) {
    return jwt.sign({ _id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: 86400 //expires in 24 hours
    });
}

const DIR = 'photos';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log(req);
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

exports.registerUser = upload.array('image[]'), (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }
        if (user) {
            return res.status(400).json({ 'msg': 'The email already exists' });
        }
        const url = 'http://18.220.197.206:5000/photos/';
        // const url = 'http://localhost:5000/photos/';
        let artisan = new User(req.body);

        artisan['selfie'] = url + req.body.selfie;
        artisan['primaryIdPic'] = url + req.body.primaryIdPic;
        artisan['nbi'] = url + req.body.nbi;
        artisan.save((err, user) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
            }
            return res.status(201).json(user);
        });
    });
};


exports.loginUser = (req, res) => {

    User.findOne({ email: req.body.email }, (err, user) => {

        if (err) {
            return res.status(400).send({ 'msg': false });
        }
        if (!user) {
            return res.status(400).json({ 'msg': 'The user does not exist' });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                loggedusers.push(user)
                return res.send({ type: true, token: createToken(user), userId: user._id })
            } else {
                return res.status(400).json({ msg: 'The email and password don\'t match.' });
            }
        });
    })
};

exports.logoutUser = (req, res) => {
    let count = 0
    User.findOne({ _id: req.body.user }, (err, user) => {
        loggedusers.forEach(element => {
            if (element._id != user._id) {
                count += 1
            }
        })
        loggedusers.pop(count)
    })
}

exports.getUser = (req, res) => {
    User.find({ _id: req.body.id }, (err, user) => {
        if (err) {
            return res.send({ error: err, status: false })
        } else {
            return res.send({ status: true, data: user })
        }
    });
}

//currentUserId, cost, currentDate
exports.addJobOrders = (req, res) => {
    var sampleObject = {
        currentUser: req.body.currentUser,
        state: req.body.state,
        customerId: req.body.jobOffer._id
    }
    let usersTask = new userTask(sampleObject)
    usersTask.save()
    var dataTOAdd = {
        logsOwner: req.body.currentUser,
        jobsOfferedThroughId: req.body.jobOffer._id
    }
    let dataAdd = new logsOfHistory(dataTOAdd)
    dataAdd.save()

    Orders.findByIdAndUpdate({ _id: req.body.jobOffer._id }, { status: 'Ongoing' }, (err, result) => {
        res.send({ error: err, data: result })
    })


}

//Rejecting the jobToOrders
exports.rejectedJobOrders = (req, res) => {
    var dataTOAdd = {
        logsOwner: req.body.currentUser,
        jobsOfferedThroughId: req.body.jobOffer._id
    }
    let dataAdd = new logsOfHistory(dataTOAdd)

    dataAdd.save()
    var sampleObject = {
        currentUser: req.body.currentUser,
        state: req.body.state,
        customerId: req.body.jobOffer._id
    }

    let usersTask = new userTask(sampleObject)
    usersTask.save((err, result) => {
        res.send(result)
    })
}

//array, request, toPassarray
exports.allJobAccepted = (req, res) => {
    userTask.find({ currentUser: req.body.user, state: "accept" }, (err, result) => {
        if (err) {
            return res.send({ error: err, status: false })
        }
        else {
            res.send(result)
        }
    })
}


//all Completed Job Orders History Tracker 
exports.completedJob = (req, res) => {
    userTask.find({ currentUser: req.body.user, state: "completed" }, (err, result) => {
        if (err) {
            return res.send({ error: err, status: false })
        }
        else {
            res.send(result)
        }
    })
}

//all Rejected Job Orders History Tracker
exports.rejectedJob = (req, res) => {
    userTask.find({ currentUser: req.body.user, state: "rejected" }, (err, result) => {
        if (err) {
            return res.send({ error: err, status: false })
        }
        else {
            res.send(result)
        }
    })
}


//Delete Completed Task under Completed Tracker
exports.deletedCompletedTask = (req, res) => {
    userTask.deleteOne({ _id: req.body.deletedId }, (err, result) => {
        if (err) {
            res.jsonp({ success: false })
        }
        else {
            res.jsonp({ success: true })
        }
    })
}


//Restore Task  under Rejected History
exports.jobRestored = (req, res) => {
    Orders.find({ _id: req.body.restoreId }, (err, result) => {
        result.forEach(output => {
            if (output.status === 'Pending') {
                res.jsonp({ success: true })
            }
            else {
                res.jsonp({ success: false })
            }
        })
    })
}

exports.returnAllActiveUsers = (req, res) => {
    res.send(loggedusers)
}