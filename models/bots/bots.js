const mongoose = require('mongoose');

const BotsSchema = mongoose.Schema({
    userName: {
        type: String,
    },
    gender: {
        type: String
    },
    isBot: {
        type: Boolean,
        default: false
    },
    botType:{
        type: String
    },
    botAvailability:{
        type: String,
        enum: 'Available|Engaged'.split('|')
    },
    status: {
        type: String,
        enum: 'Inactive|Active|Locked'.split('|'),
        default: 'Active'
    },
    enable:{
        type:Boolean,
        default: true
    },
    email:{
        type: String
    }
});

module.exports = mongoose.model('Bots', BotsSchema);
