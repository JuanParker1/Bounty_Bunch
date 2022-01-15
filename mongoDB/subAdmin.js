const createUser = async (userDetails) => {
    const user = new UserModel(userDetails);
    return Promise.resolve(await user.save());
};
const getUserById = async (id) => {
    return await UserModel.findOne({ _id: id }).exec();
};

module.exports = {
    createUser,
    getUserById
};