const { signAccessToken, signRefreshToken } = require('./../utils/jwt');
const User = require('../models/usersModel');
const Mentor = require('../models/mentorsModel');
const Session = require('../models/session.model');
const AppError = require('../utils/appErrorsClass');
const catchAsyncError = require('../utils/catchAsyncErrors');

function filterObj(obj, ...allowedAtt) {
    const newObj = {};
    for (att in obj) {
        if (allowedAtt.includes(att)) {
            newObj[att] = obj[att];
        }
    }
    return newObj;
}

async function sendTokens(user, userType, statusCode, res) {
    user.password = undefined;
    let session;
    try {
        session = await Session.createSession(user._id);
    } catch (err) {
        return next(new AppError('Error creating session', 500));
    }

    const accessToken = signAccessToken(user._id, userType);

    const refreshToken = signRefreshToken(user._id, userType, session._id);

    res.status(statusCode).json({
        status: 'success',
        accessToken,
        refreshToken,
        data: { user }
    });
}

exports.signup = catchAsyncError(async (req, res, next) => {
    const signUpData = filterObj(req.body, 'name', 'email', 'pass');

    const newUser = await (req.body.type.toLowerCase() === 'mentor'
        ? Mentor
        : User
    ).create(signUpData);

    res.status(200).json({
        status: 'success',
        data: { newUser }
    });
});

exports.login = catchAsyncError(async (req, res, next) => {
    const { email, pass, type } = req.body;
    if (!email || !pass)
        return next(new AppError('Please provide email and password', 400));

    const user = await (type.toLowerCase() === 'mentor' ? Mentor : User)
        .findOne({ email })
        .select('+pass');

    sendTokens(user, type, 200, res);
});

exports.logout = catchAsyncError(async (req, res, next) => {
    //1- from the token get the user id
    //2- delete the session from the database
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    //1- get user based on email
    //2- generate random token
    //3- send it to user's email
    //4- save token to database
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    //1- get user based on token
    //2- if token has not expired and there is user, set new password
    //3- update changedPassAt property for the user
    //4- log the user in, send JWT
});

// exports.getResetToken = catchAsyncError(async (req, res, next) => {});

exports.isLogin = catchAsyncError(async (req, res, next) => {
    const [accessToken, refreshToken] = [
        req.headers.authorization?.split(' ')[1] || null,
        req.headers.authorization?.split(' ')[2] || null
    ];

    if (!accessToken || !refreshToken) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access.',
                401
            )
        );
    }

    const decodedAccessToken = await verifyToken(
        accessToken,
        process.env.JWT_REFRESH_SECRET
    );

    if (!decodedAccessToken.status) {
        const decodedRefreshToken = await verifyToken(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        if (!decodedRefreshToken.status) {
            return next(
                new AppError(
                    'You are not logged in! Please log in to get access.',
                    401
                )
            );
        }

        if (!(await Session.checkSession(decodedRefreshToken.refreshSession))) {
            return next(new AppError('Invalid session. Please re-login"', 401));
        }

        const accessToken = signAccessToken(
            decodedRefreshToken.id,
            decodedRefreshToken.userType
        );

        res.setHeader('Authorization', `Bearer ${accessToken} ${refreshToken}`);

        res.locals.statusCode = 309;
        res.locals.userId = decodedRefreshToken.id;
        res.locals.userType = decodedRefreshToken.userType;
        req.isLogin = true;
    } else {
        res.locals.userId = decodedAccessToken.id;
        res.locals.userType = decodedAccessToken.userType;
        req.isLogin = true;
    }
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        const { userType } = res.locals;
        if (!roles.includes(userType.toLowerCase())) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403
                )
            );
        }
        next();
    };
};
