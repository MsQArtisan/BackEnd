const mongoose = require('mongoose')
const Customers = require('./User')

let Booking = new mongoose.Schema({

    service_booking: {
        type: String,
        required: true
    },
    service_location: {
        type: String,
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    notes: {
        type: String,
    },
    schedule: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Customers,
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Bookings', Booking)