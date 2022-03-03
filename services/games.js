const {
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

/* const CreateGame = async (req, res, next) => {
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
      res.data = await createGame(gameDetails, req.user._id);
    });
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
}; */

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

module.exports = {
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
