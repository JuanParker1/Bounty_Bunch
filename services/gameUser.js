let errors = require('errors/index');

const axios = require("axios");

const { getUserById, createUser, updateUser, getallUser } = require("../mongoDB/gameUser");

const GetUsersById = async (req, res, next) => {
    try {
        const user = await getUserById(req.params.userId);
        // console.log(user);

        const body = {
            _id: req.params.userId
        };

        const url = "http://3.20.92.220:3000/api/v1/BBusers/userDetails";
        
        const responseData = await axios.post(url, body);

        // console.log("response-data: ", responseData);
        // console.log("user: ", user);
        // console.log("response-data: ", responseData.data.data[0]);

        if (user) {

            delete responseData.data.data[0]._id;
            res.data = await updateUser(responseData.data.data[0]._id, responseData.data.data[0]
            );
        }
        else {
            res.data = await createUser(responseData.data.data[0]);
            // console.log("res-data: ", res.data);
        }

        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

const GetAllUsers = async (req, res, next) => {
    try {
        res.data = await getallUser();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
};

module.exports = {
    GetUsersById,
    GetAllUsers
};