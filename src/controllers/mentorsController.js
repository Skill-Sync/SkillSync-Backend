const Mentor = require('./../models/mentorsModel');
const AppError = require('./../utils/appErrorsClass');
const factory = require('./controllerUtils/handlerFactory');
const catchAsyncError = require('./../utils/catchAsyncErrors');
// ---------- mentor Operations ---------//
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.UpdateMe = catchAsyncError(async (req, res, next) => {});
//----------Admin Operations- ----------//
exports.getMentor = factory.getOne(Mentor);
exports.getAllMentors = factory.getAll(Mentor);
exports.activateMentor = factory.activateOne(Mentor);
exports.deactivateMentor = factory.deactivateOne(Mentor);
