let mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

let fields = {
    bannerType: {
        type: String,
        enum: 'GameCategory|GameList'.split('|')
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
};

let Schema = require('utils/generate-schema')(fields);


Schema.index({ gameCategory: 1, gameName: 1 }, { background: true });

module.exports = Schema;