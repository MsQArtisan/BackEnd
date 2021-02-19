var mongoose = require('mongoose');

var CashSchema = new mongoose.Schema({
    name:  {
        type: String,
        required: 'name is required'
    },
    currentBalance: {
        type: float,
        required: 'currentBalance is required'
    },
    avgPerMonth: {
        type: Array,
        required: 'avgPerMonth is required'
    }
})

module.exports = mongoose.model('Cash', CashSchema);