var mongoose = require('mongoose');

var artisanCreditsSchema = new mongoose.Schema({
    certainUserID: {
        type: String,
        required: true
    },
    certainUserCredits: {
        type: Number,
        required: true
    },
    userSituation: {
        type: String,
        required: true
    }
})

module.exports  = mongoose.model('ArtisansCredits', artisanCreditsSchema);