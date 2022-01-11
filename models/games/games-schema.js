let mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

let fields = {
    gameName: {
        type: String,
        required: true
    },
    gameStatus: {
        type: String,
        enum: 'Inactive|Active'.split('|'),
        default: 'Active'
    },
    gameCategory: {
        type: ObjectId,
        ref: 'gameCategory',
        required: true
    },
    rules: {
        type: String
    },
    description: {
        type: String
    },
    gameType: {
        type: String,
        enum: 'SinglePlayer|MultiPlayer'.split('|'),
        default: 'SinglePlayer',
        required: true
    },
    type: {
        type: String,
        enum: 'Free|Paid|Both'.split('|'),
        default: 'Free'
    },
    noOfParticipants: {
        type: Number
    },
    totalParticipants: Number,
    icon: {
        type: String
    },
    bundleIdentifier:{
        type: String
    },
    banner: [{
        type: String
    }],
    gameResults: {

    },
    enable:{
        type:Boolean,
        default: true
    },
    apkUrl: {
        type: String,
        default: 'no-url'
    },
    html5Url: {
        type: String,
        default: 'no-url'
    },
    version: {
        type: String,
        default: '0.00'
    },
    activityName: {
        type: String
    },
    packageName: {
        type: String
    },
    applicationType: {
        type: String,
        enum: 'Apk'.split('|'),
        default: 'Apk'
    }
};

let Schema = require('utils/generate-schema')(fields);


Schema.index({ gameName: 1 }, { background: true });

module.exports = Schema;