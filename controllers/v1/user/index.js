const {
    CreateBot,
    CreateBulkBot,
    GetBots
} = require('../../../services/bots')

const {
    CreateSubAdmin,
    GetSubAdmins,
    GetSubAdminById,
    EnableDisableSubAdmin,
    EditSubAdmin,
    Self
} = require('../../../services/subAdmin')

const {
    GetUsersById,
    GetAllUsers
} = require('../../../services/gameUser')
module.exports = [
    // {
    //     path: "/",
    //     method: "post",
    //     public: true,
    //     controller: userController.createUser
    //},
    {
        path: "/create-sub-admin",
        method: "post",
        allUsers: true,
        controller: CreateSubAdmin
    },
    {
        path: "/get-sub-admin",
        method: "get",
        allUsers: true,
        controller: GetSubAdmins
    },
    {
        path: "/:id/get-subadmin-by-id",
        method: "get",
        allUsers: true,
        controller: GetSubAdminById
    },
    {
        path: '/:id/enable-disable-sub-admin',
        method: 'put',
        allUsers: true,
        controller: EnableDisableSubAdmin
    },
    {
        path: '/:id/edit-sub-admin',
        method: 'put',
        allUsers: true,
        controller: EditSubAdmin
    },
    // {
    //     path: "/create-player",
    //     method: "post",
    //     public: true,
    //     controller: userController.createUser
    // },
    {
        path: "/create-bots",
        method: "post",
        public: true,
        controller: CreateBulkBot
    },
    {
        path: "/create-bot",
        method: "post",
        public: true,
        controller: CreateBot
    },
    {
        path: "/get-bot",
        method: "get",
        allUsers: true,
        controller: GetBots
    },
    // {
    //     path: "/",
    //     method: "get",
    //     allUsers: true,
    //     controller: userController.getUsers
    // },
    {
        path: "/getUser/:userId",
        method: "get",
        allUsers: true,
        controller: GetUsersById
    },
    {
        path: "/getUsers",
        method: "get",
        allUsers: true,
        controller: GetAllUsers
    },
    // {
    //     path: "/set-password",
    //     method: "put",
    //     public: true,
    //     controller: userController.updatePassword
    // },

    {
        path: "/self",
        method: "get",
        allUsers: true,
        controller: Self
    },
    // {
    //     path: "/get-user-analytics",
    //     method: "get",
    //     allUsers: true,
    //     controller: userController.getUserAnalytics
    // },
    // {
    //     path: "/:id/get-user-logs",
    //     method: "get",
    //     allUsers: true,
    //     controller: userController.getUserLogs
    // },

];