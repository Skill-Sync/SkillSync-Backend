const User = require('./../models/usersModel');
const factory = require('./controllerUtils/handlerFactory');

const AppError = require('./../utils/appErrorsClass');
const catchAsyncError = require('./../utils/catchAsyncErrors');
// ---------- User Operations ---------//
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.UpdateMe = catchAsyncError(async (req, res, next) => {});
exports.deactivateUser = factory.deactivateOne(User);
//------Basic Admin CRUD Operations------//
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.activateUser = factory.activateOne(User);
exports.deleteUser = factory.deleteOne(User);
