const Mentor = require('../models/mentor.model');
const Meeting = require('../models/meeting.model');
const factory = require('./controllerUtils/handlerFactory');
const calculateMeetingSlots = require('../services/meetings.services');

const AppError = require('../utils/appErrorsClass');
const catchAsyncError = require('../utils/catchAsyncErrors');
//------------handler functions ------------//
const filterObj = (obj, ...allowedFields) => {
  const returnedFiled = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) returnedFiled[key] = obj[key];
  });
  return returnedFiled;
};
// ---------- mentor Operations ---------//
exports.getMe = (req, res, next) => {
  req.params.id = res.locals.userId;
  next();
};

exports.UpdateMe = catchAsyncError(async (req, res, next) => {
  if (req.body.pass || req.body.passConfirm) {
    return next(new AppError('This route is not for password updates.', 400));
  }

  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'about',
    'experience',
    'identityCard',
    'courses'
  );

  const updatedUser = await Mentor.findById(req.params.id);
  Object.keys(filteredBody).forEach(key => {
    updatedUser[key] = filteredBody[key];
  });
  await updatedUser.save({ runValidators: true });

  res.status(res.locals.statusCode || 200).json({
    status: 'success',
    data: updatedUser
  });
});

exports.setWorkingHours = catchAsyncError(async (req, res, next) => {
  const mentorId = req.params.id;
  const { workingHours } = req.body;

  // Find the mentor by ID
  const mentor = await Mentor.findById(mentorId);
  if (!mentor) {
    return next(new AppError('No mentor found with that ID', 404));
  }

  // Calculate meeting slots for the next 7 days
  const nextWeekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const meetingSlots = nextWeekDates.reduce((slots, day) => {
    slots.push(...calculateMeetingSlots(workingHours, day));
    return slots;
  }, []);

  // Create an array of meetings for the mentor
  const mentorMeetings = meetingSlots.map(date => ({
    mentor: mentorId,
    scheduledDate: date
  }));

  try {
    // Insert meetings into the database
    await Meeting.insertMany(mentorMeetings);

    // Update the mentor's working hours
    mentor.workHoursRange = workingHours;

    await mentor.save();

    res.status(res.locals.statusCode || 200).json({
      status: 'success'
    });
  } catch (error) {
    console.error(error.message);
    return next(new AppError('Error creating meetings', 500));
  }

  //   .toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //     hour: '2-digit'
  //   })
});
//------Basic Admin CRUD Operations------//
exports.getMentor = factory.getOne(Mentor);
exports.getAllMentors = factory.getAll(Mentor);
exports.activateMentor = factory.activateOne(Mentor);
exports.deleteMentor = factory.deleteOne(Mentor);
//-----Advance Admin CRUD Operations-----//
exports.verifyMentor = catchAsyncError(async (req, res, next) => {
  const mentor = await Mentor.findOneAndUpdate(
    {
      _id: req.params.id,
      onboarding_completed: true
    },
    { isVerified: true }
  );

  if (!mentor) {
    return next(new AppError('No mentor found with ID ready to verify', 404));
  }

  res.status(res.locals.statusCode || 200).json({
    status: 'success',
    data: mentor
  });
});

exports.getMentorsReq = catchAsyncError(async (req, res, next) => {
  const mentors = await Mentor.find({
    isVerified: false,
    onboarding_completed: true
  });

  res.status(res.locals.statusCode || 200).json({
    status: 'success',
    results: mentors.length,
    data: mentors
  });
});
