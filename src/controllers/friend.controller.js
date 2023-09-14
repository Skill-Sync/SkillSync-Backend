const AppError = require('../utils/appErrorsClass');
const FriendShip = require('../models/friendship.model');
const catchAsyncError = require('../utils/catchAsyncErrors');
// ---------- User Operations ---------//
exports.getMyFriends = catchAsyncError(async (req, res, next) => {
    const userId = res.locals.userId;

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
exports.createEditFriendship = catchAsyncError(async (req, res, next) => {
    const userId = res.locals.userId;
    const friendId = req.params.id;
    const { status } = req.body;

    if (userId === friendId)
        return next(new AppError('You cannot be friends with yourself', 400));

    const friendship = await FriendShip.findOne({
        $or: [
            { user_1: userId, user_2: friendId },
            { user_1: friendId, user_2: userId }
        ]
    });

    if (!friendship) {
        status = status == 'rejected' ? 'rejected' : 'pending';
        const newFriendship = await FriendShip.create({
            user_1: userId,
            user_2: friendId,
            status
        });
        if (!newFriendship)
            return next(new AppError('Could not create friendship', 400));
        res.status(res.locals.statusCode || 200).json({ newFriendship });
    }

    if (friendship.status === 'accepted')
        return next(new AppError('You are already friends', 400));

    if (friendship.status === 'rejected') {
        return res.status(res.locals.statusCode || 200).json({ friendship });
    }

    if (status === 'accepted') {
        friendship.status = 'accepted';
        await friendship.save();
    } else if (status === 'rejected') {
        friendship.status = 'rejected';
        await friendship.save();
    }

    res.status(res.locals.statusCode || 200).json({ friendship });
});

exports.deleteFriend = catchAsyncError(async (req, res, next) => {
    const userId = res.locals.userId;
    const friendId = req.params.id;

    const friendship = await FriendShip.findOne({
        $or: [
            { user_1: userId, user_2: friendId },
            { user_1: friendId, user_2: userId }
        ]
    });

    if (!friendship)
        return next(new AppError('Could not find friendship', 400));

    await friendship.remove();

    res.status(res.locals.statusCode || 204).json({
        status: 'success',
        data: null
    });
});
