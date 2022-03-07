const express = require('express');
const router = express.Router();

const Joi = require('joi');

const tournamentTable = require("../models/tournament_user_table");

const tournamentTableSchema = Joi.object().keys({
    tournamentId: Joi.string().required,
    userId: Joi.string().required()
});

router.post("/register", async(req, res) => {
    try{
        const tournament = await tournamentTableSchema.validate(req.body);
        if(tournament.error){
            return res.status(400).json(
                {
                    "error": true,
                    "message": tournament.error.message
                }
            );
        }

        let user = await tournamentTable.find({ tournamentId: tournament.value.tournamentId, userId: tournament.value.userId});
        if(user){
            return res.status(400).json({
                "message": `user id ${tournament.value.userId}, is already registered with tournament id ${tournament.value.tournamentId}`
            });
        };

        const newTournamentTable = new adminAuthModel(tournament.value);
        await newTournamentTable.save();

        return res.status(200).json({
            "success": true,
            "message": "Registration Success",
            "subAdmin": newsubAdmin
        });


    }catch(error){
        return res.status(500).json({
            "error": true,
            "message": "Cannot Register",
            "reason": error.message
        });
    }
});

module.exports = router