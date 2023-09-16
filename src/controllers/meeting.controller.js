const User = require('../models/user.model');
const Mentor = require('../models/mentor.model');
const Meeting = require('../models/meeting.model');
const AppError = require('../utils/appErrorsClass');
const catchAsyncError = require('../utils/catchAsyncErrors');
const { createDyteMeeting, addUserToMeeting } = require('../utils/dyte');
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

exports.getMyAuthToken = catchAsyncError(async (req, res, next) => {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting)
        return next(new AppError('No meeting found with that ID', 404));

    if (
        meeting.user.toString() !== res.locals.userId &&
        meeting.mentor.toString() !== res.locals.userId
    ) {
        return next(
            new AppError('You are not authorized to access this meeting', 401)
        );
    }

    const user =
        res.locals.userType === 'mentor'
            ? Mentor.findById(res.locals.userId)
            : User.findById(res.locals.userId);

    const token = await addUserToMeeting(meeting.dyteMeetingId, {
        name: user.name,
        preset_name: 'test',
        custom_participant_id: res.locals.userId
    });

    if (!token) return next(new AppError('Error generating token', 500));

    res.status(res.locals.statusCode || 200).json({
        status: 'success',
        data: {
            meetingId: meeting.dyteMeetingId,
            token
        }
    });
});

exports.updateMeeting = catchAsyncError(async (req, res, next) => {
    const status = req.body.status == 'accepted' ? 'accepted' : 'rejected';
    const meeting = await Meeting.findOneAndUpdate(
        { _id: req.params.id, status: 'pending' },
        { status },
        { new: true }
    );
    if (status === 'accepted') {
        const meetingId = await createDyteMeeting(meeting.id);
        meeting.dyteMeetingId = meetingId;
        await meeting.save();
    }

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
    })
        .populate({ path: 'user', select: 'name email' })
        .populate({ path: 'mentor', select: 'name email' });

    if (!meeting)
        return next(new AppError('No meeting found with that ID', 404));

    res.status(res.locals.statusCode || 200).json({
        status: 'success',
        length: meeting.length,
        data: meeting
    });
});
