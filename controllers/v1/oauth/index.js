'use strict';
const config = require('config');
const oauth = require('./oauth')(config);
const auth = require('./auth');

// const { register, login, logout } = require('./user_auth');

module.exports = [
    {
        path: '/token',
        name: 'Login',
        method: 'post',
        public: true,
        controller: oauth
    },
    {
        path: '/logout',
        method: 'get',
        allUsers: true,
        controller: auth.logout
    }
    // {
    //     path: '/register',
    //     // name: 'Register',
    //     method: 'post',
    //     public: true,
    //     controller: register
    // },
    // {
    //     path: '/login',
    //     // name: 'Login',
    //     method: 'post',
    //     public: true,
    //     controller: login
    // },
    // {
    //     path: '/logout',
    //     method: 'post',
    //     allUsers: true,
    //     controller: logout
    // }
];