const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
let fields = {
    gameId: {
        type: ObjectId,
        ref: 'game'
    },
    tableName: {
        type: String,
        required: false
    },
    attempts: {
        type: String
    },
    tableImage: {
        type: String,
        required: false
    },
    noOfAttempts: {
        type: String
    },
    entryFee: {
        type: String
    },
    winningAmount: {
        type: String
    },
    adminStake: {
        type: String
    },
    tournmentSize: {
        type: String,
        required: false
    },
    noOfWinners: {
        type: String,
        required: false
    },
    winners: [{
        winnerCount: {
            type: String
        },
        prize: {
            type: Number
        }
    }],
    description: {
        type: String
    },
    rules: {
        type: String
    },
    tourStartDate: {
        type: Date
    },
    tourEndTime: {
        type: Date
    },
    regStartDate: {
        type: Date,
        default: new Date()
    },
    regStartTime: {
        type: String,
        default: new Date().getTime()
    },
    startDate: {
        type: Date,
        default: new Date()
    },
    startTime: {
        type: String,
        default: new Date().getTime()
    },
    endDate: {
        type: Date
    },
    endTime: {
        type: String
    },
    mode: {
        type: String
    },
    alternateTourStartDate: {
        type: Date,
        default: new Date()
    },
    alternateTourStartTime: {
        type: String,
        default: new Date().getTime()
    },
    alternateRegStartDate: {
        type: Date,
        default: new Date()
    },
    alternateRegStartTime: {
        type: String,
        default: new Date().getTime()
    },
    alternateRegenddate: {
        type: Date
    },
    alternateRegendtime: {
        type: String
    },
    alternateDate: {
        type: Date,
        default: new Date()
    },
    alternateTime: {
        type: String,
        default: new Date().getTime()
    },
    section: {
        type: String,
        enum: 'Tournment|Live|Demo'.split('|'),
        default: 'Tournment',
        required: false
    },
    tournmentType: {
        type: String,
        enum: 'Fixed|TimePeriod'.split('|'),
        default: 'Fixed',
        required: false
    },
    botAlternate: {
        type: String,
        enum: 'Bots|Alternate|Fixed'.split('|'),
        default: 'Fixed',
        required: false
    },
    bots: {
        type: String
    },
    activestatus: {
        type: String
    },
    bonus: {
        type: String
    },
    autoCreate: {
        type: String
    },
    enable: {
        type: Boolean,
        default: true
    },
    types: {
        type: String
    },
    status: {
        type: String,
        enum: 'Inactive|Active'.split('|'),
        default: 'Active'
    },
    botsActivation: {
        type: Boolean,
        default: true
    },
    totalBots: {
        type: Number
    },
    fairPlayBots: {
        type: Number
    },
    mustWinBots: {
        type: Number
    },
    minPlayer: {
        type: Number
    },
    prizeData: {
        type: Array
    },
    // ////////////////////////////////////
    gameName: {
        type: String,
        enum: ['Poker', 'Rummy', null],
        default: null
    },
    gameMode: {
        type: String
    },
    gameSpeed: String,
    noOfPlayers: String,
    gameDescription: String,
    gameRules: String,
    entryFee: Number,
    adminStake: Number,
    bonusesLimit: Number,
    minEntryFee: String,
    maxEntryFee: String,
    minStack: String,
    maxStack: String,
    ////////////////////////////////////////
    poolGameType: { type: String, default: null },
    noOfDeals: { type: String, default: null },
    gameType: { type: String, default: null },
    battleDescription: String,
    battleRules: { type: String, default: null },
    winningType: { type: String, default: null },
    entryFee: Number,
    adminStake: Number,
    pointValue: Number,
    ////////////////////////////////////////////////u
    users: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'userGame'
            }
        }
    ]
};

let Schema = require('utils/generate-schema')(fields);


// Schema.index({ gameName: 1 }, { background: true });

module.exports = Schema;