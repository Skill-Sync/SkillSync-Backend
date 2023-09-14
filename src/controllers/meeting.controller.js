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

    const meetingsQuery =
        res.locals.userType === 'mentor'
            ? { mentor: userId, status: { $nin: ['not-selected', 'rejected'] } }
            : { user: userId };
    const populateOptions =
        res.locals.userType === 'mentor'
            ? { path: 'user' }
            : {
                  path: 'mentor',
                  populate: {
                      path: 'skill',
                      select: 'name'
                  }
              };

    const meetings = await Meeting.find(meetingsQuery).populate(
        populateOptions
    );

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

exports.updateMeeting = catchAsyncError(async (req, res, next) => {
    const status = req.body.status == 'accepted' ? 'accepted' : 'rejected';
    const meeting = await Meeting.findOneAndUpdate(
        { _id: req.params.id, status: 'pending' },
        { status },
        { new: true }
    );
    if (!meeting)
        return next(new AppError('No meeting found with that ID', 404));

    res.status(res.locals.statusCode || 200).json({
        status: 'success',
        data: meeting
    });
});

exports.createMeeting = catchAsyncError(async (req, res, next) => {
    const userId = res.locals.userId;
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, {
        user: userId,
        status: 'pending'
    });

    if (!meeting)
        return next(new AppError('No meeting found with that ID', 404));

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
    if (!meeting)
        return next(new AppError('No meeting found with that ID', 404));

    res.status(res.locals.statusCode || 200).json({
        status: 'success',
        length: meeting.length,
        data: meeting
    });
});
