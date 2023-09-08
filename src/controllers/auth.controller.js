const {
  signAccessToken,
  signRefreshToken,
  verifyToken
} = require('./../utils/jwt');
const User = require('../models/user.model');
const Mentor = require('../models/mentor.model');
const Session = require('../models/authSession.models');
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

  // res.cookies('refreshJWT', refreshToken, { httpOnly: true });
  // res.cookies('accessJWT', accessToken, { httpOnly: true });

  res.status(statusCode).json({
    status: 'success',
    accessJWT: accessToken,
    refreshJWT: refreshToken,
    data: { user }
  });
}

exports.signup = catchAsyncError(async (req, res, next) => {
  const signUpData = filterObj(
    req.body,
    'name',
    'email',
    'pass',
    'passConfirm'
  );

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

  if (!user || !(await user.correctPassword(pass, user.pass))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  sendTokens(user, type, 200, res);
});

exports.logout = catchAsyncError(async (req, res, next) => {
  //1- from the token get the user id
  const { refreshSession } = await verifyToken(
    req.headers.authorization?.split(' ')[2],
    process.env.JWT_REFRESH_SECRET
  );
  // console.log(refreshSession);
  //2- delete the session from the database
  await Session.invalidateSession(refreshSession);
  //3- delete the cookie
  res.status(200 || res.locals.statusCode).json({
    status: 'success',
    message: 'Logged out successfully'
  });
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

exports.getResetToken = catchAsyncError(async (req, res, next) => {});

exports.isLogin = catchAsyncError(async (req, res, next) => {
  const [accessToken, refreshToken] = [
    req.headers.authorization?.split(' ')[1] || null,
    req.headers.authorization?.split(' ')[2] || null
  ];

  if (!accessToken || !refreshToken) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decodedAccessToken = await verifyToken(
    accessToken,
    process.env.JWT_REFRESH_SECRET
  );

  const decodedRefreshToken = await verifyToken(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  if (!decodedAccessToken.status) {
    if (!decodedRefreshToken.status) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
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
  }
  res.locals.userId = decodedAccessToken.id || decodedRefreshToken.id;
  res.locals.userType =
    decodedAccessToken.userType || decodedRefreshToken.userType;
  req.isLogin = true;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const { userType } = res.locals;
    if (!roles.includes(userType.toLowerCase())) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
