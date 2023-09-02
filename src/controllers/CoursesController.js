const Course = require('./../models/coursesModel');
const AppError = require('./../utils/appErrorsClass');
const factory = require('./controllerUtils/handlerFactory');
const catchAsyncError = require('./../utils/catchAsyncErrors');
// ------------- User Operations ------------//
exports.getRelatedCourses = catchAsyncError(async (req, res, next) => {});
// ------------ Mentor Operations -----------//
exports.getMyCourses = catchAsyncError(async (req, res, next) => {});
exports.createCourse = catchAsyncError(async (req, res, next) => {});
exports.updateCourse = catchAsyncError(async (req, res, next) => {});
// ---------- Basic CRUD Operations ----------//
exports.getCourse = factory.getOne(Course);
exports.getAllCourses = factory.getAll(Course);
exports.deleteCourse = factory.deleteOne(Course);
