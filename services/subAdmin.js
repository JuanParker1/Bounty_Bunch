const mongoose = require("mongoose");
let errors = require("errors/index");
let validationError = errors.ValidationError;
let { UserModel } = mongoose.model("user");
const { getUserById } = require("../mongoDB/subAdmin");

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
  try {
    if (!req.query.userType) {
      throw new validationError("Enter Valid userType");
    }

    if (req.query.userType !== "Bot") {
      console.log(req.user._id);
      if (!(await IsAdmin(req.user._id))) {
        throw new validationError("Admin can only get sub-admin details");
      }
    } else {
      throw new validationError("Admin can only get sub-admin details");
    }
    let role = await mongoose
      .model("role")
      .findOne({ name: req.query.userType })
      .exec();
    let query = { role: role._id };
    console.log(req.query.status);
    if (req.query.status !== "null") {
      query.status = req.query.status;
    }
    console.log("query:", query);
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
      let user = req.user.toObject();
      let userLogs = await getUserById(req.user._id);
      if (await IsAdmin(req.user._id)) {
          console.log("admin:")
          user.isAdmin = true;
      }
      if (await IsSubAdmin(req.user._id)) {
          console.log("sub-admin:")
          user.isSubAdmin = true;
      }
      if (await IsUser(req.user._id)) {
          console.log("user:")
          user.isUser = true;
      }
      if (!userLogs) {
          userLogs = new userLogModel({
              userId: req.user._id,
              lastLoginDate: moment(),
              logIn: moment()
          });
          await userLogs.save();
      } else {
          userLogs.logIn = moment();
          await userLogs.save();
      }
      res.data = user;
      next();
  }
const IsAdmin = async (userId) => {
  let user = await getUserById(userId);
  if (user.role) {
    let RoleModel = mongoose.model("role");
    let role = await RoleModel.findOne({ _id: user.role }).exec();
    console.log("role:", role);
    if (role.name === "Admin") {
      return true;
    }
  }
  return false;
};

const IsSubAdmin = async (userId) => {
  let user = await getUserById(userId);
  if (user.role) {
      let RoleModel = mongoose.model('role');
      let role = await RoleModel.findOne({ _id: user.role }).exec();
      if (role.name === 'Sub-Admin') {
          return true;
      }
  }
  return false;
}

const IsUser = async (userId) => {
  let user = await getUserById(userId);
  if (user.role.length > 0 || user.role) {
      let RoleModel = mongoose.model('role');
      let role = await RoleModel.findOne({ _id: user.role }).exec();
      if (role.name === 'User') {
          return true;
      }
  }
  return false
}

module.exports = {
  CreateSubAdmin,
  GetSubAdmins,
  GetSubAdminById,
  EnableDisableSubAdmin,
  EditSubAdmin,
  Self
};
