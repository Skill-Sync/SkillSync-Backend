const JWT = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/usersModel');
const AppError = require('./../utils/appErrorsClass');
const Session = require('../models/authSessionsModels');
const catchAsyncError = require('./../utils/catchAsyncErrors');
//-----------------handler functions---------------//
async function sendRefreshAndAccess(res, statusCode, userId, sessionId) {}
async function verifyToken(token, secret, status) {
  try {
    return await promisify(JWT.verify)(token, secret);
  } catch (err) {
    if (err instanceof JWT.TokenExpiredError) {
      throw new AppError('Token expired', status);
    } else if (err instanceof JWT.JsonWebTokenError) {
      throw new AppError('Invalid Token', status);
    } else {
      throw new AppError('An error occurred', status);
    }
  }
}
//------------Authentication functions ------------//
exports.isLogin = catchAsyncError(async (req, res, next) => {});
exports.restrictTo = (...roles) => {
  return catchAsyncError(async (req, res, next) => {});
};
//------------Authorization functions ------------//
exports.login = catchAsyncError(async (req, res, next) => {});
exports.signup = catchAsyncError(async (req, res, next) => {});
exports.logout = catchAsyncError(async (req, res, next) => {});
exports.generateAccessToken = catchAsyncError(async (req, res, next) => {});
//------------Password functions ------------//
exports.updatePassword = catchAsyncError(async (req, res, next) => {});
exports.forgotPassword = catchAsyncError(async (req, res, next) => {});
exports.resetPassword = catchAsyncError(async (req, res, next) => {});
exports.getResetToken = catchAsyncError(async (req, res, next) => {});
