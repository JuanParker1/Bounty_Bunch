const mongoose = require('mongoose');
const TournmentModel = mongoose.model('tournment');
const errors = require('errors/index');
const validationError = errors.ValidationError;
const UserModel = mongoose.model('user');

module.exports = {
    createTournment,
    getTournments,
    getTournmentById,
    getTournmentsBySection,
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
        tournment.tourStartDateAndTime = req.body.tourStartDateAndTime;
        tournment.tourEndDateAndTime = req.body.tourEndDateAndTime;
        tournment.regStartDateAndTime = req.body.regStartDateAndTime;
        tournment.regEndDateAndTime = req.body.regEndDateAndTime;
        tournment.mode = req.body.mode;
        tournment.alternateTourStartDateAndTime = req.body.alternateTourStartDateAndTime;
        tournment.alternateTourEndDateAndTime = req.body.alternateTourEndDateAndTime;
        tournment.alternateRegStartDateAndTime = req.body.alternateRegStartDateAndTime;
        tournment.alternateRegEndDateAndTime = req.body.alternateRegEndDateAndTime;
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
        res.data = await TournmentModel.find(query).exec();
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
    try {
        if (!req.parmas.id) {
            throw new ValidationError("enter valid tournment id");
        }
        let tournment = await TournmentModel.findOne({ _id: req.params.id }).exec();
        tournment.attempts = req.body.attempts;
        tournment.tableImage = req.body.tableImage;
        tournment.noOfAttempts = req.body.noOfAttempts;
        tournment.description = req.body.description;
        tournment.rules = req.body.rules;
        tournment.alternateTourStartDateAndTime = req.body.alternateTourStartDateAndTime;
        tournment.alternateTourEndDateAndTime = req.body.alternateTourEndDateAndTime;
        tournment.alternateRegStartDateAndTime = req.body.alternateRegStartDateAndTime;
        tournment.alternateRegEndDateAndTime = req.body.alternateRegEndDateAndTime;
        tournment.autoCreate = req.body.autoCreate;
        tournment.enable = req.body.enable;
        tournment.botsActivation = req.body.botsActivation;
        tournment.minPlayer = req.body.minPlayer;
        res.data = await tournment.save();
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