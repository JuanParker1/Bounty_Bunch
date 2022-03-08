const {
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
} = require("../../../services/games");

module.exports = [

  {
    path: "/create-game",
    method: "post",
    public: true,
    controller: CreateGame,
  },
  {
    path: "/edit-game/:id",
    method: "post",
    public: true,
    controller: editGame,
  },
  {
    path: "/get-games",
    method: "get",
    public: true,
    controller: GetGames,
  },
  {
    path: "/get-games-by-game-category",
    method: "get",
    public: true,
    controller: GetGamesByGameCategory,
  },
  {
    path: "/get-games-by-name/:name",
    method: "get",
    public: true,
    controller: GetGamesByName,
  },
  {
    path: "/get-games-id-name",
    method: "get",
    public: true,
    controller: GetGamesIdName,
  },
  {
    path: "/:id/get-game",
    method: "get",
    public: true,
    controller: GetGameById,
  },
  {
    path: "/:id/get-game-by-category",
    method: "get",
    public: true,
    controller: GetGamesByCategory,
  },
  {
    path: "/get-singleplayer-games",
    method: "get",
    public: true,
    controller: GetSinglePlayerGames,
  },
  {
    path: "/get-multiplayer-games",
    method: "get",
    public: true,
    controller: GetMultiPlayerGames,
  },
  {
    path: "/:id/send-game-results",
    method: "put",
    public: true,
    controller: GameResults,
  },
  // UnAuthorized { status: 401, message: 'Invalid credentials' }
  {
    path: "/:id/delete-game",
    method: "delete",
    allUsers: true,
    controller: DeleteGame,
  }
];
