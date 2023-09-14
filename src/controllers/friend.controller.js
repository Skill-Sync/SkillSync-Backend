const AppError = require('../utils/appErrorsClass');
const FriendShip = require('../models/friendship.model');
const catchAsyncError = require('../utils/catchAsyncErrors');
// ---------- User Operations ---------//
exports.getMyFriends = catchAsyncError(async (req, res, next) => {
    const userId = res.locals.userId;

    // Find all accepted friendships for the user
    const friendships = await FriendShip.find({
        $or: [{ user1: userId }, { user2: userId }],
        status: 'accepted'
    })
        .populate('user1')
        .populate('user2');

    const friends = friendships.map(friendship => {
        return friendship.user1._id.toString() === userId
            ? friendship.user2
            : friendship.user1;
    });

    res.status(res.locals.statusCode || 200).json({ friends });
});
exports.getFriend = catchAsyncError(async (req, res, next) => {});
exports.deleteFriend = catchAsyncError(async (req, res, next) => {});
exports.acceptAsFriend = catchAsyncError(async (req, res, next) => {});
