const {
    signAccessToken,
    signRefreshToken,
    signEmailConfirmationToken,
    verifyToken
} = require('./../utils/jwt');
const { filterObj } = require('./../utils/ApiFeatures');
const sendEmail = require('./../utils/email/sendMail');
const User = require('../models/user.model');
const Mentor = require('../models/mentor.model');
const Session = require('../models/authSession.models');
const AppError = require('../utils/appErrorsClass');
const catchAsyncError = require('../utils/catchAsyncErrors');

async function sendTokens(user, userType, statusCode, res) {
    user.password = undefined;
    let session;
    try {
        session = await Session.createSession(user._id);
    } catch (err) {
        return next(new AppError('Error creating session', 500));
    }

    if (userType.toLowerCase() === 'user') {
        userType = user.role;
    }

    const accessToken = signAccessToken(user._id, userType);

    const refreshToken = signRefreshToken(user._id, userType, session._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('refreshJWT', refreshToken, cookieOptions);
    res.cookie('accessJWT', accessToken, cookieOptions);

    let responseObject =
        userType.toLowerCase() === 'mentor'
            ? {
                  name: user.name,
                  email: user.email,
                  about: user.about,
                  experience: user.experience,
                  identityCard: user.identityCard,
                  courses: user.courses,
                  onboarding_completed: user.onboarding_completed
              }
            : {
                  name: user.name,
                  email: user.email,
                  photo: user.photo,
                  about: user.about,
                  isEmployed: user.isEmployed,
                  skillsToLearn: user.skillsToLearn,
                  onboarding_completed: user.onboarding_completed,
                  skillsLearned: user.skillsLearned
              };

    res.status(statusCode).json({
        status: 'success',
        accessJWT: accessToken,
        refreshJWT: refreshToken,
        data: { responseObject }
    });
}

exports.signup = catchAsyncError(async (req, res, next) => {
    const { type } = req.body;
    const signUpData = filterObj(
        req.body,
        'name',
        'email',
        'pass',
        'passConfirm'
    );

    // Create a new user based on the 'type' (Mentor or User)
    const newUser = await (type.toLowerCase() === 'mentor'
        ? Mentor
        : User
    ).create(signUpData);

    // Create email confirmation token and confirmation URL
    const emailConfirmationToken = signEmailConfirmationToken(
        newUser._id,
        type
    );
    const emailConfirmationURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/auth/confirmEmail/${emailConfirmationToken}`;

    // Send email with the confirmation link
    sendEmail(
        newUser.email,
        'Confirm your Email (valid for 10 min)',
        {
            name: newUser.name,
            link: emailConfirmationURL
        },
        './templates/mailConfirmation.handlebars'
    );

    let responseObject =
        type.toLowerCase() === 'mentor'
            ? {
                  name: newUser.name,
                  email: newUser.email,
                  about: newUser.about,
                  experience: newUser.experience,
                  identityCard: newUser.identityCard,
                  courses: newUser.courses,
                  onboarding_completed: newUser.onboarding_completed
              }
            : {
                  name: newUser.name,
                  email: newUser.email,
                  photo: newUser.photo,
                  about: newUser.about,
                  isEmployed: newUser.isEmployed,
                  skillsToLearn: newUser.skillsToLearn,
                  onboarding_completed: newUser.onboarding_completed,
                  skillsLearned: newUser.skillsLearned
              };

    res.status(200).json({
        status: 'success',
        data: responseObject
    });
});

exports.confirmEmail = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;

    const authenticationToken = await verifyToken(
        token,
        process.env.JWT_EMAIL_CONFIRMATION_SECRET
    );

    const user = await (authenticationToken.userType.toLowerCase() === 'mentor'
        ? Mentor
        : User
    ).findByIdAndUpdate(authenticationToken.id, {
        active: true
    });

    //update user status
    // user.active = true;
    // await user.save({ validateBeforeSave: false });

    //send welcome email
    sendEmail(
        user.email,
        'Welcome to our website',
        { name: user.name },
        './templates/welcome.handlebars'
    );

    //send the response
    res.status(200).json({
        status: 'success',
        message: 'Your account has been activated successfully'
    });
});

exports.login = catchAsyncError(async (req, res, next) => {
    const { email, pass, type } = req.body;
    if (!email || !pass)
        return next(new AppError('Please provide email and password', 400));

    const user = await (type.toLowerCase() === 'mentor' ? Mentor : User)
        .findOne({ email })
        .select('+pass');

    if (!user || !(await user.correctPassword(pass, user.pass))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    if (!user.active) {
        return next(new AppError('Your account is not active', 401));
    }

    sendTokens(user, type, 200, res);
});

exports.logout = catchAsyncError(async (req, res, next) => {
    const { refreshSession } = await verifyToken(
        req.headers.authorization?.split(' ')[2],
        process.env.JWT_REFRESH_SECRET
    );
    await Session.invalidateSession(refreshSession);
    //3- delete the cookie
    res.status(res.locals.statusCode || 200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await (req.body.type.toLowerCase() === 'mentor'
        ? Mentor
        : User
    ).findOne({ email: req.body.email });

    const resetToken = user.createPasswordResetToken();
    const resetURL = `${process.env.CLIENT_URL}/resetPass/${resetToken}`;
    sendEmail(
        user.email,
        'Reset your password (valid for 5 min)',
        { name: user.name, link: resetURL },
        './templates/requestResetPassword.handlebars'
    );
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const { token, type } = req.params;

    const user = await (type.toLowerCase() === 'mentor'
        ? Mentor
        : User
    ).findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('The token is invalid or has expired', 404));
    }
    user.pass = req.body.pass;
    user.passConfirm = req.body.passConfirm;
    //3- update changedPassAt property for the user
    // user.chancgedPassAt = Date.now() - 1000;
    await user.save({ validateBeforeSave: false });

    await Session.InvalidateAllUserSessions(user_id);

    //TODO:Redirect to login page
    res.status(200).json({
        status: 'success',
        message: 'Password reset successfully'
    });
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
        process.env.JWT_ACCESS_SECRET
    );

    const decodedRefreshToken = await verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    );

    if (!decodedAccessToken.status) {
        if (!decodedRefreshToken.status) {
            return next(new AppError('You are not logged in! ', 401));
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
    }

    if (!decodedRefreshToken.status) {
        return next(new AppError(decodedRefreshToken.message, 401));
    }

    res.locals.userId = decodedAccessToken.id || decodedRefreshToken.id;
    res.locals.userType =
        decodedAccessToken.userType || decodedRefreshToken.userType;
    req.isLogin = true;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(res.locals.userType.toLowerCase())) {
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
