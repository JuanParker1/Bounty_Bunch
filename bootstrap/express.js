const express = require('express');
const cors = require('cors');

module.exports = function (app, config) {

    app.use(express.json({ limit: '5mb' }));

    app.use(express.urlencoded({ limit: '5mb', extended: true }));

    app.use(cors(
        {
            "origin": "*",
            "methods": ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        }
    ));

    app.use("/api/admin", require('../router/admin_auth'));
    app.use("/api/sub-admin", require('../router/sub_admin'));
    app.use("/api/tournament-table", require("../router/tournament_table"));

    app.set('port', config.port || "4800");
}