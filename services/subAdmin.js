const mongoose = require("mongoose");
let errors = require("errors/index");
let validationError = errors.ValidationError;
let { UserModel } = mongoose.model("user");
const User = mongoose.model('user');
let RoleModel = mongoose.model("role");
// const { getUserById } = require("../mongoDB/subAdmin");

const CreateSubAdmin = async (req, res, next) => {
  try {
    if (req.body.subAdmin) {
      if (!(await IsAdmin(req.user._id))) {
        throw new validationError("Admin can only create the states");
      }
    }
    res.data = await UserModel.createUser(req.body);
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const GetSubAdmins = async (req, res, next) => {

  console.log('get req user', req);
  console.log("get sub-admin req id", req.request_logs._id);
  console.log('get req user', req.user);
  try {

    if (!req.query.userType) {
      throw new validationError("Enter Valid userType");
    }

    if (req.query.userType !== "Bot") {
      // console.log("get sub admin req user id", req.user);
      if (!(await IsAdmin(req.user._id))) {
        throw new validationError("Admin can only get sub-admin details");
      }
    } else {
      throw new validationError("Admin can only get sub-admin details");
    }

    let role = await mongoose.model("role").findOne({ name: req.query.userType }).exec();

    let query = { role: role._id };

    console.log("get sub admin query", query);
    console.log("get sub admin req status", req.query.status);

    if (req.query.status !== "null") {
      query.status = req.query.status;
    }

    res.data = await UserModel.find(query).populate("moduleAccess").exec();

    next();

  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const GetSubAdminById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new validationError("Enter Valid id");
    }
    let role = await mongoose
      .model("role")
      .findOne({ name: "Sub-Admin" })
      .exec();
    res.data = await UserModel.findOne({
      _id: req.params.id,
      role: role._id,
    }).exec();
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const EnableDisableSubAdmin = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new validationError("enter valid id");
    }
    let userData = await UserModel.findOne({ _id: req.params.id }).exec();
    userData.status = req.body.enable ? "Active" : "Inactive";
    userData.enable = req.body.enable;
    console.log("userDt:", userData);
    res.data = await userData.save();
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const EditSubAdmin = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new validationError("enter valid id");
    }
    let userData = await UserModel.findOne({ _id: req.params.id }).exec();
    userData.firstName = req.body.firstName;
    userData.lastName = req.body.lastName;
    userData.fullName = userData.firstName + " " + userData.lastName;
    if (req.body.password) {
      await UserModel.updatePassword(req.body.phoneNumber, req.body.password);
    }
    userData.address = req.body.address;
    userData.moduleAccess = req.body.moduleAccess;
    res.data = await userData.save();
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const Self = async (req, res, next) => {
  console.log('********************************************')
  console.log(req.body.userId)
  console.log('********************************************')
  let user = await User.findOne({ _id: req.body.userId });

  var isAdmin, isUser, isSubAdmin;
  if (IsAdmin(req.body.userId)) {
    console.log("admin:");
    isAdmin = true;
  }
  if (IsSubAdmin(req.body.userId)) {
    console.log("sub-admin:")
    isSubAdmin = true;

  }
  if (IsUser(req.body.userId)) {
    console.log("user:")
    isUser = true;
  }
  // if (!userLogs) {
  //   userLogs = new userLogModel({
  //     userId: req.body.userId,
  //     lastLoginDate: moment(),
  //     logIn: moment()
  //   });
  //   await userLogs.save();
  // } else {
  //   userLogs.logIn = moment();
  //   await userLogs.save();
  // }
  console.log(user, isAdmin, isSubAdmin, isUser)
  res.data = {
    user: user,
    isAdmin: isAdmin,
    isSubAdmin: isSubAdmin,
    isUser: isUser
  };
  next();
}

const GetUserAnalytics = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.body.id });

    //let role = await mongoose.model('role').findOne({ name: 'Admin' }).exec();
    let role = await RoleModel.findOne({ _id: user.role }).exec();

    console.log(role)

    if (role.name !== "Admin") {
      throw new validationError('Admin can only get sub-admin details');
    }
    user.role = role
    console.log("data:", user);
    res.data = user;
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
}


const IsAdmin = async (userId) => {
  User.findOne({ _id: userId }).exec(async function (err, user) {
    if (err) {
      return false;
    }
    console.log('######################################', user)
    if (user.role) {
      let role = await RoleModel.findOne({ _id: user.role }).exec();
      console.log("role:", role);
      if (role.name === "Admin") {
        return true;
      }
    }
    return false;
  });
  return false;
};

const IsSubAdmin = async (userId) => {
  console.log("user", User);
  User.findOne({ _id: userId }).exec(async function (err, user) {
    if (err) {
      return false;
    }
    if (user.role) {
      let role = await RoleModel.findOne({ _id: user.role }).exec();
      console.log("role:", role);
      if (role.name === "Sub-Admin") {
        return true;
      }
    }
    return false;
  });
  return false;
}

const IsUser = async (userId) => {
  User.findOne({ _id: userId }).exec(async function (err, user) {
    if (err) {
      return false;
    }
    if (user.role) {
      let role = await RoleModel.findOne({ _id: user.role }).exec();
      console.log("role:", role);
      if (role.name === "User") {
        return true;
      }
    }
    return false;
  });
  return false;
}

module.exports = {
  CreateSubAdmin,
  GetSubAdmins,
  GetSubAdminById,
  EnableDisableSubAdmin,
  EditSubAdmin,
  Self,
  GetUserAnalytics
};
