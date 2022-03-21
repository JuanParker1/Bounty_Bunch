const mongoose = require('mongoose');
const TournmentModel = mongoose.model('tournment');
const errors = require('errors/index');
const validationError = errors.ValidationError;
const UserModel = mongoose.model('user');

const { awsStorageUploadImage } = require("../../../utils/aws-storage");

const formidable = require("formidable");

const createTournment = async (req, res) => {
    try {

        const form = await new formidable.IncomingForm({ multiples: true });
        form.parse(req, async (error, fields, files) => {

            if (error) {
                return res.json({
                    error: error.message
                });
            }
            console.log("fields:", fields);
            console.log("files:", files);

            const tournamentDetails = (fields);
            // console.log('tournamentDetailes:', tournamentDetails);

            const image = await awsStorageUploadImage(files.tableImage);
            // console.log("tableImage:", image);
            tournamentDetails.banners = image;

            const newTournament = await TournmentModel(tournamentDetails);

            return res.status(200).json({
                "message": `Tournament added to database successfully`,
                "New-Tournament": newTournament
            });

        });
    } catch (error) {
        return res.status(500).json(
            {
                message: `something went wrong`,
                error: error.message
            }
        )
    }
}

async function createBots(req, res, next) {
    try {
        console.log("bots", req.body)

        res.data = TournmentModel.createBots(req.body);
        next();
    } catch (err) {
        errors.handleException(err, next);
    }
}

async function getTournments(req, res, next) {
    try {
        let query = {};
        if (req.query.status !== 'null') {
            query.Status = req.query.status;
        }
        res.data = await TournmentModel.find(query).populate('users.userId').exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getTournmentByTableName(req, res, next) {
    try {
        let query = {};
        if (req.query.tableName) {
            query.tableName = req.query.tableName;
            query.gameId = req.query.gameId;
        }
        else {
            query.gameId = req.query.gameId;
        }
        res.data = await TournmentModel.find(query).populate('gameId').exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getTournmentsBySection(req, res, next) {
    try {
        let query = { section: req.query.section };
        // if (req.query.section !== 'null') {
        //     query.section = req.query.section;
        //     query.gameId = req.query.gameId;
        // }
        // else {
        //     query.gameId = req.query.gameId;
        // }
        res.data = await TournmentModel.find(query).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getTournmentsByGameId(req, res, next) {
    try {
        res.data = await TournmentModel.find({ gameId: req.params.id }).populate('gameId').exec();
        console.log(res.data)
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getTournmentById(req, res, next) {
    try {
        let query = { _id: req.params.id };
        // if (req.query.status !== 'null') {
        //     query.status = req.query.status;
        // }
        res.data = await TournmentModel.find(query).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getTournmentByTournamentId(req, res, next) {
    try {
        res.data = await TournmentModel.findOne({ _id: req.params.id }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function deleteTournment(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid id");
        }
        res.data = await TournmentModel.remove({ _id: req.params.id }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

const editTournment = async (req, res) => {
    try {
        const tournment = await TournmentModel.findByIdAndUpdate(req.params.id).exec();

        const form = await new formidable.IncomingForm({ multiples: true });
        form.parse(req, async (error, fields, files) => {

            if (error) {
                return res.json({
                    error: error.message
                });
            }

            console.log("fields:", fields);
            console.log("files:", files);

            const tournamentDetails = (fields);
            // console.log('tournamentDetailes:', tournamentDetails);

            const image = await awsStorageUploadImage(files.tableImage);
            // console.log("tableImage:", image);
            tournment.banners = image;

            const updatedTournament = await tournment(tournamentDetails);

            await updatedTournament.save();

            return res.status(200).json({
                "message": `tournament updated successfully`,
                "Updated-Tournament": updatedTournament
            });

        });
    } catch (error) {
        return res.status(500).json(
            {
                message: `something went wrong`,
                error: error.message
            }
        )
    }

};

// update tournament user list
const tournamentUserUpdate = async (req, res) => {
    try { 
        const id = req.params.id;
        const { users } = req.body;
        console.log(
            {
                param: id,
                params: req.params.id,
                body: req.body
            }
        )
        const tournament = await TournmentModel.findByIdAndUpdate({_id: id }, { $addToSet: { users: users }}, { new: true } );
        
        if(!tournament){
            return res.status(500).json(
                {
                    message: `Tournament id: ${id} is not available in the database.`
                }
            )
        }else if(tournament.error){
            return res.status(400).json(
                {
                    message: tournament.error.message
                }
            )
        }else{
            return res.status(200).json(
                {
                    message: `user linked to the tournament successfully`,
                    response: tournament
                }
            )
        }

    } catch (error) {
        return res.status(500).json(
            {
                message: `something went wrong`,
                error: error.message
            }
        )
    }
};

async function enableDisableTournment(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid id");
        }
        let tournmentData = await TournmentModel.findOne({ _id: req.params.id }).exec();
        tournmentData.status = req.body.enable ? "Active" : "Inactive";
        tournmentData.enable = req.body.enable;
        res.data = await tournmentData.save();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

module.exports = {
    tournamentUserUpdate,
    createTournment,
    getTournments,
    getTournmentByTableName,
    getTournmentById,
    getTournmentByTournamentId,
    getTournmentsBySection,
    getTournmentsByGameId,
    deleteTournment,
    editTournment,
    enableDisableTournment,
    createBots
};