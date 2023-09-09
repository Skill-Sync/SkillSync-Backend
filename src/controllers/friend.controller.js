const AppError = require('../utils/appErrorsClass');
const FriendShip = require('../models/friendship.model');
const catchAsyncError = require('../utils/catchAsyncErrors');
// ---------- User Operations ---------//
exports.getFriend = catchAsyncError(async (req, res, next) => {});
exports.getMyFriends = catchAsyncError(async (req, res, next) => {});
exports.deleteFriend = catchAsyncError(async (req, res, next) => {});
exports.acceptAsFriend = catchAsyncError(async (req, res, next) => {});
