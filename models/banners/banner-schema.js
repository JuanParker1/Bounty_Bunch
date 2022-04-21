let mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

let fields = mongoose.Schema({
    bannerType: {
        type: String,
        enum: 'GameCategory|GameList|GameLandingPage|TournamentBanner|Game'.split('|')
    },
    typeId: {
        type: String
    },
    status: {
        type: String,
        enum: 'Inactive|Active'.split('|'),
        default: 'Active'
    },
    enable: {
        type: Boolean,
        default: true
    },
    gameCategory: {
        type: ObjectId,
        ref: 'gameCategory',
        required:false
    },
    gameName: {
        type: ObjectId,
        ref: 'game',
        required:false
    },
    banners: {
        type: Array
    }
});

module.exports = mongoose.model("Banner", fields);