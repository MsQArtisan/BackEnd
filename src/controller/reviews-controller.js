var Reviews = require('../models/Reviews');

exports.getReviews = (req, res) => {
    Reviews.find({}, (err, reviews) => {
        if (err) {
            return res.send({ error: err, status: false })
        } else {
            return res.send({ status: true, data: reviews })
        }
    })
}
