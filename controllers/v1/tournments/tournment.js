const mongoose = require('mongoose');
const TournmentModel = mongoose.model('tournment');
const errors = require('errors/index');
const validationError = errors.ValidationError;
const UserModel = mongoose.model('user');

module.exports = {
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

async function createTournment(req, res, next) {
    try {
        // if (!await UserModel.isSubAdmin(req.user._id)) {
        //     throw validationError("can created by subadmin")
        // }
        console.log("here:", req.body);
        //res.data = TournmentModel.createTournment(req.body);
        // console.log('User Id', req.user)
        let tournment = {};
        tournment.attempts = req.body.attempts;
        tournment.tableImage = req.body.tableImage;
        tournment.noOfAttempts = req.body.noOfAttempts;
        tournment.description = req.body.description;
        tournment.rules = req.body.rules;
        tournment.autoCreate = req.body.autoCreate;
        tournment.enable = req.body.enable;
        tournment.botsActivation = req.body.botsActivation;
        tournment.minPlayer = req.body.minPlayer;
        tournment.gameId = req.body.gameId;
        tournment.section = req.body.section;
        tournment.tableName =req.body.tableName;
        tournment.entryFee = req.body.entryFee;
        tournment.winningAmount = req.body.winningAmount;
        tournment.adminStake = req.body.adminStake;
        tournment.tournmentSize = req.body.tournmentSize;
        tournment.noOfWinners = req.body.noOfWinners;
        tournment.winners = req.body.winners;
        tournment.description = req.body.description;
        tournment.rules = req.body.rules;
        tournment.tourStartDate = req.body.tourStartDate;
        tournment.tourEndTime = req.body.tourEndTime;
        tournment.regStartDate = req.body.regStartDate;
        tournment.regStartTime = req.body.regStartTime;
        tournment.startDate = req.body.startDate;
        tournment.startTime = req.body.startTime;
        tournment.endDate = req.body.endDate;
        tournment.endTime = req.body.endTime;
        tournment.mode = req.body.mode;
        tournment.alternateTourStartDate = req.body.alternateTourStartDate;
        tournment.alternateTourStartTime = req.body.alternateTourStartTime;
        tournment.alternateRegStartDate = req.body.alternateRegStartDate;
        tournment.alternateRegStartTime = req.body.alternateRegStartTime;
        tournment.alternateRegenddate = req.body.alternateRegenddate;
        tournment.alternateRegendtime = req.body.alternateRegendtime;
        tournment.alternateDate = req.body.alternateDate;
        tournment.alternateTime = req.body.alternateTime;
        tournment.section = req.body.section;
        tournment.tournmentType = req.body.tournmentType;
        tournment.bots = req.body.bots;
        tournment.bonus = req.body.bonus;
        tournment.autoCreate = req.body.autoCreate;
        tournment.enable = req.body.enable;
        tournment.types = req.body.types;
        tournment.status = req.body.status;
        tournment.botsActivation = req.body.botsActivation;
        tournment.totalBots = req.body.totalBots;
        tournment.fairPlayBots = req.body.fairPlayBots;
        tournment.mustWinBots = req.body.mustWinBots;
        tournment.minPlayer = req.body.minPlayer;
        tournment.prizeData = req.body.prizeData;

        console.log('User Id', req.user)
        res.data = TournmentModel.createTournment(tournment, req.user._id);
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function createBots(req, res, next) {
    try {
        console.log("bots", req.body)
        
        res.data = TournmentModel.createBots(req.body, req.user._id);
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
        res.data = await TournmentModel.find(query).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getTournmentByTableName(req, res, next) {
    try {
        res.data = await TournmentModel.find({tableName: req.params.tableName}).exec();
        console.log(res.data);
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getTournmentsBySection(req, res, next) {
    try {
        let query = {};
        if (req.query.section !== 'null') {
            query.section = req.query.section;
            query.gameId = req.query.gameId;
        }
        else {
            query.section = 'Tournment'
        }
        console.log(query);
        res.data = await TournmentModel.find(query).populate('gameId').exec();
        console.log(res.data)
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getTournmentsByGameId(req, res, next) {
    try {
        res.data = await TournmentModel.find({gameId: req.params.id}).exec();
        console.log(res.data)
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getTournmentById(req, res, next) {
    try {
        let query = { gameId: req.params.id };
        if (req.query.status !== 'null') {
            query.status = req.query.status;
        }
        res.data = await TournmentModel.find(query).populate('gameId').exec();
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
async function editTournment(req, res, next) {

    console.log(req);
    let tournment = await TournmentModel.findOne({ _id: req.params.id }).exec();
    if(tournment)
    try {
        if (!tournment.id) {
            throw new ValidationError("enter valid tournment id");
        }
        res.data = await TournmentModel.updateOne(
            { "_id": req.params.id}, // Filter
                  {$set: {"description": req.body.description,
                "rules": req.body.rules}}, // Update
                  {upsert: true} // add document with req.body._id if not exists 
        ).then((result) => {
               console.log(result.body)
             }).catch((error) => {
               console.log(error)
             });
             next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

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