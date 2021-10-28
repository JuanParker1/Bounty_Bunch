const mongoose = require('mongoose');
let TournmentSchema = require('./tournment-schema');


TournmentSchema.statics = {
    createTournment
}

let TournmentModel = mongoose.model('tournment', TournmentSchema);

module.exports = TournmentModel;

async function createTournment(body, requestUser) {
    let tournment = new TournmentModel(body);

    tournment.section = body.section;

    console.log(tournment);
    tournment.createdBy = requestUser;
    return await tournment.save();
}