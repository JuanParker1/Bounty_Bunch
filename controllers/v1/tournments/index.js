let tournmentController = require('./tournment');

module.exports = [
    {
        path: '/',
        method: 'post',
        allUsers: true,
        controller: tournmentController.createTournment
    },
    {
        path: '/:id/get-tournment',
        method: 'get',
        public: true,
        controller: tournmentController.getTournmentById
    },
    {
        path: '/:id/get-tournment-by-tournamentId',
        method: 'get',
        public: true,
        controller: tournmentController.getTournmentByTournamentId
    },
    {
        path: '/get-tournments-by-section',
        method: 'get',
        public: true,
        controller: tournmentController.getTournmentsBySection
    },
    {
        path: '/:id/get-tournments-by-gameId',
        method: 'get',
        public: true,
        controller: tournmentController.getTournmentsByGameId
    },
    {
        path: '/get-tournments',
        method: 'get',
        public: true,
        controller: tournmentController.getTournments
    },
    {
        path: '/get-tournments-by-table-name',
        method: 'get',
        public: true,
        controller: tournmentController.getTournmentByTableName
    },
    {
        path: '/:id/edit-tournament',
        method: 'put',
        allUsers: true,
        controller: tournmentController.editTournment
    },
    {
        path: '/:id/delete-tournment',
        method: 'delete',
        allUsers: true,
        controller: tournmentController.deleteTournment
    },
    {
        path: '/:id/enable-disable-tournment',
        method: 'put',
        allUsers: true,
        controller: tournmentController.enableDisableTournment
    },
    
]