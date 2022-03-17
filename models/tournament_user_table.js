const mongoose = require('mongoose');
const { Schema } = mongoose;

const tournamentTableSchema = new Schema(
    {
        tournamentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tournment',
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }]
    }
);

module.exports = mongoose.model('TournamentTable', tournamentTableSchema);