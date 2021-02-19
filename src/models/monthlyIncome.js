var mongoose = require('mongoose')

let incomeStats = new mongoose.Schema({
    currentTime: {
        type: Date,
        required: true
    },
    cost: {
        type: String,
        required: true 
    },
    currentUser: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('incomeStatistics', incomeStats)    