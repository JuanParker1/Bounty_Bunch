const mongoose = require("mongoose");
const GameModel = mongoose.model("game");

/* const createGame = async (gameDetails) => {
  const game = new Games(gameDetails);
  return Promise.resolve(await game.save());
}; */

const getGames = async (query) => {
  const data = await GameModel.find(query)
    .populate("gameCategory")
    .lean()
    .exec();

  return Promise.resolve(data);
};

const getGamesIdName = async () => {
  const data = await GameModel.find({}).select("_id gameName").lean().exec();
  return Promise.resolve(data);
};

const getSinglePlayerGames = async () => {
  const data = await GameModel.find({ gameType: "SinglePlayer" })
    .populate("gameCategory")
    .lean()
    .exec();
  return Promise.resolve(data);
};

const getMultiPlayerGames = async () => {
  const data = await GameModel.find({ gameType: "MultiPlayer" })
    .populate("gameCategory")
    .lean()
    .exec();
  return Promise.resolve(data);
};

const getGameById = async (req) => {
  const data = await GameModel.findOne({ _id: req.params.id })
    .populate("gameCategory")
    .lean()
    .exec();
  return Promise.resolve(data);
};

const getGamesByName = async (req) => {
  const data = await GameModel.find({ gameName: req.params.name })
    .populate("gameCategory")
    .lean()
    .exec();
  return Promise.resolve(data);
};

const gameResults = async (req) => {
  const data = await GameModel.gameResults(req.params.id, req.body);

  return Promise.resolve(data);
};

const deleteGame = async (req) => {
  if (!req.params.id) {
    throw new validationError("enter valid id");
  }
  const data = await GameModel.remove({ _id: req.params.id }).exec();
  return Promise.resolve(data);
};

const getGamesByCategory = async (req) => {
  if (!req.params.id) {
    throw new validationError("enter valid categoryId");
  }
  const data = await GameModel.find({ gameCategory: req.params.id }).exec();
  return Promise.resolve(data);
};

const enableDisableGames = async (req) => {
  let gameData = await GameModel.findOne({ _id: req.params.id }).exec();
  gameData.gameStatus = req.body.enable ? "Active" : "Inactive";
  gameData.enable = req.body.enable;
  res.data = await gameData.save();
};

module.exports = {
  getGames,
  getGamesIdName,
  getSinglePlayerGames,
  getMultiPlayerGames,
  getGameById,
  getGamesByName,
  gameResults,
  deleteGame,
  getGamesByCategory,
  enableDisableGames,
};
