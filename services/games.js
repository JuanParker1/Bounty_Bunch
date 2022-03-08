const {
  createGame,
  getGames,
  getGamesByGameCategory,
  getGamesIdName,
  getSinglePlayerGames,
  getMultiPlayerGames,
  getGameById,
  getGamesByName,
  gameResults,
  deleteGame,
  getGamesByCategory,
  enableDisableGames,
} = require("../mongoDB/games");
const {
  awsStorageUploadImage,
  awsStorageUploadApk,
} = require("../utils/aws-storage");
var formidable = require("formidable");

const errors = require("./../errors/index");

const CreateGame = async (req, res, next) => {
  try {
    // if (!await UserModel.isSubAdmin(req.user._id)) {
    //     throw new validationError("Can be Created By Sub Admin");
    // }
    //console.log(req.user._id);
    var form = await new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      //console.log("files:", files);
      const gameDetails = JSON.parse(fields.data);
      console.log(gameDetails);
      let data = await awsStorageUploadImage(files.file_path2);
      console.log(data);
      gameDetails.icon = data;

      if (files.file_path) {
        let data2 = await awsStorageUploadApk(files.file_path);
        console.log(data2);
        gameDetails.apkUrl = data2;
      }
      res.data = await createGame(gameDetails);
    });
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const newGame = async (req, res, next) => {
  try{

    console.log(req.body);

    const gameCategory = req.body.gameCategory;
    const gameType = req.body.gameType === "" ? 'SinglePlayer' : req.body.gameType;
    const gameName = req.body.gameName === "" ? null : req.body.gameName;
    const gameStatus = req.body.gameStatus;
    const rule = req.body.rule;
    const description = req.body.description;
    const type = req.body.type === "" ? 'Free' : req.body.type;
    const noOfParticipants = req.body.noOfParticipants;
    const totalParticipants = req.body.noOfWinners;
    const icon = req.body.icon;
    const bundleIdentifier = req.body.bundleIdentifier;
    const banner = req.body.banner;
    // const gameResults = req.body.gameResults;
    const enable = req.body.enable;
    const apkUrl = req.body.apkUrl;
    const html5Url = req.body.html5Url;
    const version = req.body.version;
    const activityName = req.body.activityName;
    const packageName = req.body.packageName;
    const applicationType = req.body.applicationType === "" ? 'Apk' : req.body.applicationType;

    const game = await createGame({
      gameCategory : gameCategory,
      gameType : gameType,
      gameName : gameName,
      gameStatus : gameStatus,
      rule : rule,
      description : description,
      type : type,
      noOfParticipants : noOfParticipants,
      totalParticipants : totalParticipants,
      icon : icon,
      bundleIdentifier : bundleIdentifier,
      banner : banner,
      // gameResults : gameResults,
      enable : enable,
      apkUrl : apkUrl,
      html5Url : html5Url,
      version : version,
      activityName : activityName,
      packageName : packageName,
      applicationType : applicationType
    });

    if(game.error){
      return res.status(400).json({
        message: game.error.message
      });
    }
    return res.status(200).json({
      message: "success",
      "newGame": game
    });

    next()

  }catch(error){
    res.json({ message: error.message });
  }
}

const GetGames = async (req, res, next) => {
  try {
    let query = {};
    // if (req.query.status !== 'undefined') {
    //   query.gameStatus = req.query.status;
    // }
    res.data = await getGames(query);
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const GetGamesByGameCategory = async (req, res, next) => {
  try {
    let query = {};
    // if (req.query.gameCategoryId) {
    //   query.gameCategoryId = req.query.gameCategoryId;
    // }
    res.data = await getGamesByGameCategory(req.query.gameCategoryId);
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const GetGamesIdName = async (req, res, next) => {
  try {
    res.data = await getGamesIdName();
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const GetSinglePlayerGames = async (req, res, next) => {
  try {
    res.data = await getSinglePlayerGames();
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const GetMultiPlayerGames = async (req, res, next) => {
  try {
    res.data = await getMultiPlayerGames();
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const GetGameById = async (req, res, next) => {
  try {
    res.data = await getGameById(req);
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};
const GetGamesByName = async (req, res, next) => {
  try {
    res.data = await getGamesByName(req);
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const GameResults = async (req, res, next) => {
  try {
    res.data = await gameResults(req);
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const DeleteGame = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new validationError("enter valid id");
    }
    res.data = await deleteGame(req);
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const GetGamesByCategory = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new validationError("enter valid categoryId");
    }
    res.data = await getGamesByCategory(req);
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const EnableDisableGames = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new validationError("enter valid id");
    }

    res.data = await enableDisableGames(req);
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

async function editGame(req, res, next) {
  try {
    if (!req.params.id) {
      throw new validationError("Send valid Id");
    }
    let gameData = await GameModel.findOne({ _id: req.params.id }).exec();

    var form = await new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      //console.log("files:", files);
      const gameDetails = JSON.parse(fields.data);
      console.log(gameDetails);
      if (files.file_path2) {
        let data = await awsStorageUploadImage(files.file_path2);
        console.log(data);
        gameData.icon = data;
      }

      if (files.file_path) {
        let data2 = await awsStorageUploadApk(files.file_path);
        console.log(data2);
        gameData.apkUrl = data2;
      }
      gameData.version = gameDetails.version;
      gameData.activityName = gameDetails.activityName;
      gameData.packageName = gameDetails.packageName;
      gameData.html5Url = gameDetails.html5Url;

      gameData.description = gameDetails.description;
      gameData.bundleIdentifier = gameDetails.bundleIdentifier;
      gameData.type = gameDetails.type;
      gameData.gameType = gameDetails.gameType;

      res.data = await gameData.save();
    });
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
} 

module.exports = {
  CreateGame,
  editGame,
  newGame,
  GetGames,
  GetGamesByGameCategory,
  GetGamesIdName,
  GetSinglePlayerGames,
  GetMultiPlayerGames,
  GetGameById,
  GetGamesByName,
  GameResults,
  DeleteGame,
  GetGamesByCategory,
  EnableDisableGames,
};
