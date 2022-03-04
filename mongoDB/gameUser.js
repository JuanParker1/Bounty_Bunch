const { userGamee } = require('../models/user/usergame-schema');

const createUser = async (userDetails) => {
    const user = new userGamee(userDetails);
    return Promise.resolve(await user.save());
};

const updateUser = async (id, details) => {
  
    const updatedUser = await userGamee.updateOne(
      { _id: id },
      {
        $set: details,
      }
    );
  
    return Promise.resolve(updatedUser);
};

const getUserById = async (id) => {
    const userById = await userGamee.findOne({ _id: id }).exec();
    // console.log("get-user-by-id: ", userById);
    return Promise.resolve(userById);
};

const getallUser = async (id) => {
  // const users = await userGamee.find({ isBot: true });
  const users = await userGamee.find({});
  return Promise.resolve(users);
};

module.exports = {
    createUser,
    updateUser,
    getUserById,
    getallUser
};