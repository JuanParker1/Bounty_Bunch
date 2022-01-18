const userData = require("./../models/user/usergame-schema");

const createUser = async (userDetails) => {
    const user = new userData(userDetails);
    return Promise.resolve(await user.save());
};
const getUserById = async (id) => {
    return await userData.findOne({ _id: id }).exec();
};

module.exports = {
    createUser,
    getUserById
};