const Meeting = require('../models/meeting.model');
const AppError = require('../utils/appErrorsClass');
const catchAsyncError = require('../utils/catchAsyncErrors');
const {
  standMentorsMeeting,
  standUsersMeeting
} = require('../utils/ApiFeatures');
// ------------- User Operations ------------//
exports.getMyMeetings = catchAsyncError(async (req, res, next) => {
  const userId = res.locals.userId;
  let meetingsQuery = { user: userId };
  let populatePath = 'mentor';

  if (res.locals.userType == 'mentor') {
    meetingsQuery = { mentor: userId, status: { $ne: 'not-selected' } };
    populatePath = 'user';
  }

  const meetings = await Meeting.find({
    ...meetingsQuery
  }).populate({
    path: populatePath
  });

  const selectedMeetings = meetings.map(meeting => {
    if (res.locals.userType === 'mentor') {
      return standMentorsMeeting(meeting);
    } else {
      return standUsersMeeting(meeting);
    }
  });

  res.status(res.locals.statusCode || 200).json({
    status: 'success',
    results: selectedMeetings.length,
    data: selectedMeetings
  });
});

exports.updateMeeting = catchAsyncError(async (req, res, next) => {});
exports.createMeeting = catchAsyncError(async (req, res, next) => {
  const userId = res.locals.userId;
  const mentorId = req.params.id;
  const { scheduledDate } = req.body;

  const meeting = await Meeting.find({
    mentor: mentorId,
    scheduledDate
  });

  res.status(res.locals.statusCode || 201).json({
    status: 'success',
    data: meeting
  });
});
// ---------- Basic CRUD Operations ----------//
exports.getMeeting = catchAsyncError(async (req, res, next) => {
  const meeting = await Meeting.find({
    mentor: req.params.id
  });
  if (!meeting) return next(new AppError('No meeting found with that ID', 404));

  res.status(res.locals.statusCode || 200).json({
    status: 'success',
    length: meeting.length,
    data: meeting
  });
});
