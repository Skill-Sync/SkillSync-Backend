const factory = require('./controllerUtils/handlerFactory');
const User = require('./../models/usersModel');
const AppError = require('./../utils/appErrorsClass');
const catchAsyncError = require('./../utils/catchAsyncErrors');
// ---------- User Operations ---------//
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.UpdateMe = catchAsyncError(async (req, res, next) => {});
// ---------- Basic CRUD Operations ----------//
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.activateUser = factory.activateOne(User);
exports.deactivateUser = factory.deactivateOne(User);
