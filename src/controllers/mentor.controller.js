const Mentor = require('../models/mentor.model');
const factory = require('./controllerUtils/handlerFactory');

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
        return next(
            new AppError('This route is not for password updates.', 400)
        );
    }

    const filteredBody = filterObj(
        req.body,
        'name',
        'email',
        'about',
        'experience',
        'identityCard',
        'skillsToLearn',
        'skillsLearned',
        'courses'
    );

    const updatedUser = await Mentor.findById(req.params.id);
    Object.keys(filteredBody).forEach(key => {
        updatedUser[key] = filteredBody[key];
    });
    await updatedUser.save({ runValidators: true });

    res.status(res.locals.statusCode || 200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deactivateMentor = factory.deactivateOne(Mentor);
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
        return next(
            new AppError('No mentor found with ID ready to verify', 404)
        );
    }

    res.status(res.locals.statusCode || 200).json({
        status: 'success',
        data: {
            mentor
        }
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
        data: {
            mentors
        }
    });
});
