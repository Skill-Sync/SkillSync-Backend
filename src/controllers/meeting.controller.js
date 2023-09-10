const Meeting = require('../models/meeting.model');
const AppError = require('../utils/appErrorsClass');
const factory = require('./controllerUtils/handlerFactory');
const catchAsyncError = require('../utils/catchAsyncErrors');
// ------------- User Operations ------------//
exports.getMyMeetings = catchAsyncError(async (req, res, next) => {
  const userId = res.locals.userId;
  let meetings;
  if (res.locals.userType === 'mentor') {
    meetings = await Meeting.find({
      mentor: userId,
      state: { $ne: 'not-selected' }
    });
  } else {
    meetings = await Meeting.find({ user: userId });
  }

  res.status(200).json({
    status: 'success',
    results: meetings.length,
    data: {
      meetings
    }
  });
});
exports.updateMeeting = catchAsyncError(async (req, res, next) => {});
exports.createMeeting = catchAsyncError(async (req, res, next) => {});
// ---------- Basic CRUD Operations ----------//
exports.getMeeting = factory.getOne(Meeting);
