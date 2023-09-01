const factory = require('./handlerFactory');
const User = require('./../models/usersModel');
const Session = require('./../models/sessionsModel');
const AppError = require('./../utils/appErrorsClass');
const catchAsyncError = require('./../utils/catchAsyncErrors');
// ----------Active User Operations ---------//
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
//----------Admin CRUD functions- ----------//
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.activateUser = factory.activateOne(User);
exports.deactivateUser = factory.deactivateOne(User);
