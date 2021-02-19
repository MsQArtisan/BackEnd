var mongoose = require('mongoose')
const Orders = require('../models/Bookings')

const taskOfUsers = new mongoose.Schema({
    currentUser: {
        type: String,
        required: true,
    },
    state: {
        type: Object,
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Orders
    }
})
module.exports = mongoose.model('taskofusers', taskOfUsers);