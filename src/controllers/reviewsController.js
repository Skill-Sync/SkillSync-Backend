const Review = require('./../models/reviewsModel');
const AppError = require('./../utils/appErrorsClass');
const factory = require('./controllerUtils/handlerFactory');
const catchAsyncError = require('./../utils/catchAsyncErrors');
//----------------Alias Methods----------------//
exports.setCourseUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.course) req.body.course = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
//----------Normal CRUD functions ----------//
exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);