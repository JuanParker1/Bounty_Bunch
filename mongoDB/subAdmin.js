const userData = require("./../models/user/usergame-schema");

const adminAuthModel = require("../models/user/admin_auth_schema");

const createSubAdmin =  async(subAdmin) => {
    const subAdmin = new adminAuthModel(subAdmin);
    return Promise.resolve(await subAdmin.save());
};

const createUser = async (userDetails) => {
    const user = new userData(userDetails);
    return Promise.resolve(await user.save());
};

const getUserById = async (id) => {
    return await userData.findOne({ _id: id }).exec();
};

module.exports = {
    createSubAdmin,
    createUser,
    getUserById
};