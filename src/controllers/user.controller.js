const User = require('../models/user.model');
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
// ---------- User Operations ---------//
exports.getMe = (req, res, next) => {
  req.params.id = res.locals.user.id;
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
    'isEmployed',
    'skillsToLearn',
    'skillsLearned'
  );

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
exports.deactivateUser = factory.deactivateOne(User);
//------Basic Admin CRUD Operations------//
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.activateUser = factory.activateOne(User);
exports.deleteUser = factory.deleteOne(User);
