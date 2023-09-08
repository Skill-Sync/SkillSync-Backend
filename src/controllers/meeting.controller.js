const Meeting = require('../models/meeting.model');
const AppError = require('../utils/appErrorsClass');
const factory = require('./controllerUtils/handlerFactory');
const catchAsyncError = require('../utils/catchAsyncErrors');
// ------------- User Operations ------------//
exports.getMyMeetings = catchAsyncError(async (req, res, next) => {});
exports.createMeeting = catchAsyncError(async (req, res, next) => {});
exports.updateMeeting = catchAsyncError(async (req, res, next) => {});
// ---------- Basic CRUD Operations ----------//
exports.getMeeting = factory.getOne(Meeting);
exports.getAllMeetings = factory.getAll(Meeting);
exports.deleteMeeting = factory.deleteOne(Meeting);
