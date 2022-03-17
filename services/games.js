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
  awsStorageUploadBanner
} = require("../utils/aws-storage");

const formidable = require("formidable");

const errors = require("./../errors/index");

const CreateGame = async (req, res, next) => {
  try {
    var form = await new formidable.IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {

      if (error) {
        return res.status(400).json({
          "message": error.message
        })
      }

      // res.json({ fields, files });

      // console.log("fields:", fields);
      // console.log("files:", files);

      const gameDetails = (fields);
      // console.log('gameDetails', gameDetails);

      const icon = await awsStorageUploadImage(files.icon);
      // console.log("icon: ", icon);
      gameDetails.icon = icon;

      const banner = await awsStorageUploadBanner(files.banner);
      // console.log("banner:", banner);
      gameDetails.banner = banner;

      if (files.apkUrl) {
        const apkUrl = await awsStorageUploadApk(files.apkUrl);
        // console.log("apkUrl:", apkUrl);
        gameDetails.apkUrl = apkUrl;
      }

      const newGame = await createGame(gameDetails);

      return res.status(200).json(
        {
          "message": `new game creatation was successfull`,
          "new-game": newGame
        }
      )

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

    var form = await new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (error, fields, files) => {
      //console.log("files:", files);
      const gameDetails = JSON.parse(fields.data);
      // console.log(gameDetails);

      const icon = await awsStorageUploadImage(files.icon);
      // console.log("icon: ", icon);
      gameData.icon = icon;

      const banner = await awsStorageUploadBanner(files.banner);
      // console.log("banner:", banner);
      gameData.banner = banner;

      if (files.apkUrl) {
        const apkUrl = await awsStorageUploadApk(files.apkUrl);
        // console.log("apkUrl:", apkUrl);
        gameData.apkUrl = apkUrl;
      }

      gameData.version = gameDetails.version;
      gameData.activityName = gameDetails.activityName;
      gameData.packageName = gameDetails.packageName;
      gameData.html5Url = gameDetails.html5Url;

      gameData.description = gameDetails.description;
      gameData.bundleIdentifier = gameDetails.bundleIdentifier;
      gameData.type = gameDetails.type;
      gameData.gameType = gameDetails.gameType;

      const updateGameData = await gameData.save();

      return res.status(200).json({
        message: "game updated successfully",
        game: updateGameData
      })

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

module.exports = {
  CreateGame,
  editGame,
  // newGame,
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
