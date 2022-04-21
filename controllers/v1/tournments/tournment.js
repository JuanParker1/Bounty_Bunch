const mongoose = require('mongoose');
const TournmentModel = mongoose.model('tournment');
const TournamentUserTable = require("../../../models/tournament_user_table");
const errors = require('errors/index');
const validationError = errors.ValidationError;
const UserModel = require('../../../models/user/usergame-schema');

const { awsStorageUploadImage } = require("../../../utils/aws-storage");

const formidable = require("formidable");

const multer = require("../../../utils/multer");

// create tournament function using formidable
// const createTournment = async (req, res) => {
//     try {
// 
//         const form = await new formidable.IncomingForm({ multiples: true });
//         form.parse(req, async (error, fields, files) => {

//             if (error) {
//                 return res.json({
//                     error: error.message
//                 });
//             }
//             console.log("fields:", fields);
//             console.log("files:", files);

//             const tournamentDetails = (fields);
//             // console.log('tournamentDetailes:', tournamentDetails);

//             const image = await awsStorageUploadImage(files.tableImage);
//             // console.log("tableImage:", image);
//             tournamentDetails.tableImage = image;

//             const newTournament = await TournmentModel(tournamentDetails);

//             if (newTournament.error) {
//                 return res.status(400).json(
//                     {
//                         message: newTournament.error.message
//                     }
//                 )
//             }

//             await newTournament.save();

//             return res.status(200).json({
//                 "message": `Tournament added to database successfully`,
//                 "New-Tournament": newTournament
//             });

//         });
//     } catch (error) {
//         return res.status(500).json(
//             {
//                 message: `something went wrong`,
//                 error: error.message
//             }
//         )
//     }
// }



// create Tournment using multer
const createTournment = async (req, res) => {
    multer.uploadTournamentImage(req, res, async (error) => {

        console.log("fields", req.body);
        console.log('files', req.file);
        // console.log("request", req);

        if (error) {

            console.log('errors', error);
            return res.status(500).json({
                status: 'fail',
                error: error
            });

        } else {

            // If File not found
            if (req.file === undefined) {
                console.log('uploadTournamentImages Error: No File Selected!');
                return res.status(500).json({
                    status: 'fail',
                    message: 'Error: No File Selected'
                });
            } else {

                // If Success
                let fields = req.body
                console.log("Fields:", fields);

                let iconFile = req.file;
                let fileLocation = iconFile.location;


                const newTournament = await TournmentModel(
                    fields,
                    fields.icon = fileLocation
                );
                await newTournament.save();

                // Save the file name into database
                return res.status(200).json({
                    status: 'ok',
                    NewTournament: newTournament,
                });

            }
        }
    });
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
        res.data = await TournmentModel.find(query).populate('users').exec();
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
        res.data = await TournmentModel.find(query).populate(UserModel).exec();
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

// const editTournment = async (req, res) => {
// 
//     try {
//         const tournment = await TournmentModel.findByIdAndUpdate(req.params.id).exec();

//         const form = await new formidable.IncomingForm({ multiples: true });
//         form.parse(req, async (error, fields, files) => {

//             if (error) {
//                 return res.json({
//                     error: error.message
//                 });
//             }

//             console.log("fields:", fields);
//             console.log("files:", files);

//             const tournamentDetails = (fields);
//             // console.log('tournamentDetailes:', tournamentDetails);

//             const image = await awsStorageUploadImage(files.tableImage);
//             // console.log("tableImage:", image);
//             tournment.banners = image;

//             const updatedTournament = await tournment(tournamentDetails);

//             await updatedTournament.save();

//             return res.status(200).json({
//                 "message": `tournament updated successfully`,
//                 "Updated-Tournament": updatedTournament
//             });

//         });
//     } catch (error) {
//         return res.status(500).json(
//             {
//                 message: `something went wrong`,
//                 error: error.message
//             }
//         )
//     }

// };




const editTournment = async (req, res) => {

    try {
        // const tournment = await TournmentModel.findByIdAndUpdate(req.params.id).exec();
        multer.uploadTournamentImage(req, res, async (error) => {

            console.log("id", req.params);
            console.log("fields", req.body);
            console.log('files', req.file);
            // console.log("fetch:", tournment);
            // console.log("request", req);

            if (error) {

                console.log('errors', error);
                return res.status(500).json({
                    status: 'fail',
                    error: error
                });

            } else {

                // If File not found
                if (req.file === undefined) {
                    console.log('uploadProductsImages Error: No File Selected!');
                    return res.status(500).json({
                        status: 'fail',
                        message: 'Error: No File Selected'
                    });
                } else {

                    // If Success
                    var fields = req.body;
                    // console.log("Fields:", fields);

                    var iconFile = req.file;
                    var fileLocation = iconFile.location;

                    fields.icon = fileLocation;

                    console.log("newF", fields);

                    var id = req.params.id;
                    const tournment = await TournmentModel.findByIdAndUpdate(req.params.id).exec();

                    console.log("updated:", tournment);
                    // var updatedGameCategory = await tournment(fields);
                    await tournment.save();
                    // console.log("updated:", updatedGameCategory);

                    // Save the file name into database
                    return res.status(200).json({
                        status: 'ok',
                        gameCategory: tournment,
                    });

                }
            }
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


// update tournmanet 
// const tournamentUpdate = async (req, res) => {
//     try { 
//         // check tournament user limit has reached?
//         // assing bots to the tournmant if user limit has been reached.
//         // if tournament user and bot limit not reached then cancel the tournament.

//     } catch (error) { 
//         return res.status(500).json(
//             {
//                 message: `something went wrong`,
//                 error: error.message
//             }
//         )
//     }
// }

// tournament user Register
// const tournamentUserRegister = async (req, res) => {
//     //  TODO --
//     try {
//         // fetch tournament's and user's Id's 
//         const tournamentId = req.params.tournamentId
//         const userId = req.params.tournamentId

//         // check tournament is active or cancelled
//         const tournamentCheck = await TournmentModel.findById(tournamentId);
//         console.log("Tournament Model:", tournamentCheck);
//         // if(!tournamentCheck){
//         //     return res.status(400).json(
//         //         {
//         //             message: "Tournament Does Not Exists"
//         //         }
//         //     )
//         // }else if(tournamentCheck.isCancelled){
//         //     return res.status(400).json(
//         //         {
//         //             message: "Tournament is Cancelled"
//         //         }
//         //     )
//         // }

//         // if pass then follow next step, if fail then return
//         const userCheck = await UserModel.findById(userId);
//         console.log("User Model:", userCheck);

//         // TODO check if user exists in the database.

//         //TODO check if tournament exists in the database.
//         // if pass then follow the next step and if fails then throw an issue response.

//         // TODO check if tournament and user is registered in the tournamentUserTable. [mongo find with query userId and tournamentId]
//         // if yes response => user registerd with the tournament 

//         // if false then follow the validation step and if true then throw the issue response



//     // 1. fetch all the document by tournamentId in tournamentTable
//     // 2 get count 
//     // 3 get size of tournament from tournamentId
//     // 4 if equal -> [

//     // ] 







//         // check if the users registered with the tournament has reached the minimum limit. mentioned in the tournament.
//         // if true then throw response that tournament has reached its user intake limit.
//         // if false tournament initial registration end date and time is passed then throw response that tournament registration is complete. and show the alternate, date and time to register.
//         // if tournament alternate start date and time is passed then throw response that tournament registration is closed.


//     } catch (error) {
//         return res.status(500).json(
//             {
//                 message: `something went wrong`,
//                 error: error.message
//             }
//         )
//     }
// };




// new 
const tournamentUserRegister = async (req, res) => {
    try {
        const tournamentId = req.params.tournamentId;
        const userId = req.params.userId;
        // check if user exists in the database.
        const userCheck = await UserModel.userGamee.findById(userId);
        // check if tournament exists in the database.
        const tournamentCheck = await TournmentModel.findById(tournamentId);
        if (userCheck == null) {
            console.log("User not registered");
            return res.status(500).json({
                status: 'fail',
                message: 'Error: No user Registered'
            });
        } else if(tournamentCheck == null) {
            console.log("Tournament not found");
            return res.status(500).json({
                status: 'fail',
                message: 'Error: Tournament not found'
            });
    // check tournament is active or cancelled
        }else if(tournamentCheck.isCancelled){
            console.log("Tournament Cancelled");
            return res.status(500).json({
                status: 'fail',
                message: 'Error: Tournament Cancelled'
            });
        }else{
            // TODO check if tournament and user is registered in the tournamentUserTable. [mongo find with query userId and tournamentId]
            const tournament = await TournamentUserTable.findOne({"tournamentId": tournamentId},{users: {$elemMatch: userId}});
            if(tournament.tournamentId == tournamentId){
                 // if yes response => user registerd with the tournament 
                return res.status(500).json({
                    status: 'fail',
                    message: 'user already registerd with the tournament '
                });
            }
            else{
                  // 1. fetch all the document by tournamentId in tournamentTable
                var query = {tournamentId: tournamentId};
                const tournamentList = await TournmentModel.find(query).toArray();
                // 2 get count
                // 3 get size of tournament from tournamentId
                 //4 check if the users registered with the tournament has reached the minimum limit. mentioned in the tournament.
                if (tournamentList.length >=  tournamentCheck.tournmentSize ) {
                    return res.status(500).json({
                        status: 'fail',
                        message: 'max player limit reached'
                    });
                } 
                // else if() {}


                else{
                     //    add user in array 

                const updateInTournament = TournmentModel.findByIdAndUpdate(userId, {users: userId});
                return res.status(200).json({
                    status: 'ok',
                    message: 'You are added in the tournament.'
                });
                }
                   // if false tournament initial registration end date and time is passed then throw response that tournament registration is complete. and show the alternate, date and time to register.    



               
                }
            }
            
        
        
        // alternate new tournament if minimum player not fulfilled 

       
        // if true then throw response that tournament has reached its user intake limit.
        
        // if tournament alternate start date and time is passed then throw response that tournament registration is closed.


    } catch (error) {
        return res.status(500).json(
            {
                message: `something went wrong`,
                error: error.message
            }
        );
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
    tournamentUserRegister,
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