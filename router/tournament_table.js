const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

const Joi = require('joi');

const tournamentTable = require("../models/tournament_user_table");
const tournament = require("../models/tournment/tournment-schema");

const tournamentTableSchema = Joi.object().keys({
    tournamentId: Joi.string().required(),
    users: Joi.array().required()
});

router.post("/register", async (req, res) => {
    try {
        const tournament = await tournamentTableSchema.validate(req.body);
        if (tournament.error) {
            return res.status(400).json(
                {
                    "error": true,
                    "message": tournament.error.message
                }
            );
        }


        // tournament.value.users = tournament.value.users.map(_u => {
        //     return { userId: ObjectId(_u.userId) }
        // })
        let findTournament = await tournamentTable.findOne({ tournamentId: tournament.value.tournamentId }); // get tournament id if available in the document-database
        let findTournamentUser = await tournamentTable.find({ tournamentId: tournament.value.tournamentId, users: { $in: tournament.value.users } }); // get 
       

        if (!findTournamentUser.length){
            //save
            await tournament.save();
        }
        else if(!findTournamentUser.length >= req.body.limit){
            return res.status(400).json(
                {
                    message: "limit reached"
                }
            );
        }
        else{
//update
            // await tournament.push();
        }

        // let usersInTournament = findTournament.users  //users inside the findTournamen

        // let userLimit = req.body.minPlayer; // limit will fetched from req.body 

        // console.log("tournament", findTournament);
        // console.log("users in tournamnet", usersInTournament);
        // console.log("tournament user", findTournamentUser);

        // if (findTournament && usersInTournament == findTournamentUser) {
        //     return res.status(400).json({
        //         "message": `already Exist`
        //     });
        // }/*else if (findTournamentUser.lenght >= userLimit ) {
        //     return res.status(400).json(
        //         {
        //             "message": `Maximum Player limit of ${userLimit} has reached, cannot register more user for this tournament`
        //         }
        //     )
        // }*/else {
        //     const newTournamentTable = new tournamentTable(tournament.value);
        //     // await newTournamentTable.save();
        // }

        // const newTournamentTable = new tournamentTable(tournament.value);
        // await newTournamentTable.save();
        return res.status(200).json({
            "success": true,
            "message": "Registration Success",
            "subAdmin": newTournamentTable
        });


    } catch (error) {
        return res.status(500).json({
            "error": true,
            "message": "Cannot Register",
            "reason": error.message
        });
    }
});

router.get("/get-all", async (req, res) => {
    try {
        const all = await tournamentTable.find({}).populate("tournamentId");
        if (all.lenght === 0) {
            return res.status(404).json(
                {
                    "message": "No Data to Show"
                }
            )
        } else if (all.error) {
            return res.status(400).json(
                {
                    "message": all.error
                }
            )
        } else {
            return res.status(200).json(
                {
                    "Tournament-Tables": all
                }
            )
        }
    } catch (error) {
        return res.status(500).json({
            "error": true,
            "message": "Cannot Register",
            "reason": error.message
        });
    }
});

router.patch("/update/:tournamentId", async (req, res) => {
    try {
        const update = await tournamentTable.findOneAndUpdate({ tournamentId: req.params.tournamentId }, { $addToSet: { users: [{ userId: req.body.userId }] } });
        if (!update) {
            return res.status(404).json({
                "error": true,
                "message": 'Tournament Not Found!'
            })
        } else if (update.error) {
            console.log('change-status error', update.error);
            return res.status(400).json({
                "error": true,
                "message": update.error.message
            })
        }/*else{

            update.users.userId = req.body.user
            await update.save();
        }*/
    }
    catch (error) {
        return res.status(500).json({
            "error": true,
            "message": "Cannot Register",
            "reason": error.message
        });
    }
})

module.exports = router