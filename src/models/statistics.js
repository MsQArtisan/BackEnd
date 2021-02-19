const mongoose = require('mongoose')

var statisticsSchema = new mongoose.Schema({
    name: {
        type: String
    },
    month: [{
        January: { type: String },
        February: { type: String },
        March: { type: String },
        April: { type: String },
        May: { type: String },
        June: { type: String },
        July: { type: String },
        August: { type: String },
        September: { type: String },
        Octember: { type: String },
        November: { type: String },
        December: { type: String },

    }],
    amount: [{
        500: { type: Number },
        1000: { type: Number },
        1500: { type: Number },
        3500: { type: Number },
        1500: { type: Number },
        2000: { type: Number },
        6000: { type: Number },
        3500: { type: Number },
        4000: { type: Number },
        2500: { type: Number },
        6000: { type: Number },
        3500: { type: Number },

    }]
})

module.exports = mongoose.model('statistics', statisticsSchema);