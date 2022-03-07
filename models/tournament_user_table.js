const mongoose = require('mongoose');
const { Schema } = mongoose;

const tournamentTableSchema = new Schema(
    {
        tournamentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tournment'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
        // tournamentTable: {
        //     type: Array,
        //     default: []
        // }
    }
);

module.exports = mongoose.model('TournamentTable', tournamentTableSchema);