const { userGame } = require('../models/user/usergame-schema');

const createUser = async (userDetails) => {
    const user = new userGame(userDetails);
    return Promise.resolve(await user.save());
};

const updateUser = async (id, details) => {
  
    const updatedUser = await userGame.updateOne(
      { _id: id },
      {
        $set: details,
      }
    );
  
    return Promise.resolve(updatedUser);
  };
const getUserById = async (id) => {
    return await userGame.findOne({ _id: id }).exec();
};

const getallUser = async (id) => {
  return await userGame.findOne({}).exec();
};

module.exports = {
    createUser,
    updateUser,
    getUserById,
    getallUser
};