const Mentor = require('./../models/mentorsModel');
const factory = require('./controllerUtils/handlerFactory');

const AppError = require('./../utils/appErrorsClass');
const catchAsyncError = require('./../utils/catchAsyncErrors');
// ---------- mentor Operations ---------//
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.UpdateMe = catchAsyncError(async (req, res, next) => {});
exports.deactivateMentor = factory.deactivateOne(Mentor);
//------Basic Admin CRUD Operations------//
exports.getMentor = factory.getOne(Mentor);
exports.getAllMentors = factory.getAll(Mentor);
exports.activateMentor = factory.activateOne(Mentor);
exports.deleteMentor = factory.deleteOne(Mentor);
//-----Advance Admin CRUD Operations-----//
exports.verifyMentor = catchAsyncError(async (req, res, next) => {});
exports.getMentorsReq = catchAsyncError(async (req, res, next) => {});
