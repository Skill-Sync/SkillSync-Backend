const JWT = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');
const Session = require('../models/session.model');
const AppError = require('../utils/appErrorsClass');
const catchAsyncError = require('../utils/catchAsyncErrors');

function signAccessToken(id, userType) {
  const payload = { name: 'access', id, userType };
  const secret = process.env.JWT_ACCESS_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
  return JWT.sign(payload, secret, { expiresIn });
}

function signRefreshToken(id, userType, refreshSession) {
  const payload = { name: 'refresh', id, userType, refreshSession };
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
  return JWT.sign(payload, secret, { expiresIn });
}

async function sendTokens(user, userType, statusCode, res, type) {
  user.password = undefined;
  let session;
  try {
    session = await Session.createSession(user._id);
  } catch (err) {
    return next(new AppError('Error creating session', 500));
  }

  const accessToken = signAccessToken(user._id, userType);

  if (type !== 'login') {
    return res.status(statusCode).json({
      status: 'success',
      accessToken,
      data: { user }
    });
  }

  const refreshToken = signRefreshToken(user._id, userType, session._id);

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    refreshToken,
    data: { user }
  });
}

async function verifyToken({
  accessToken,
  refreshToken,
  toVerifyTokenType,
  secret,
  status
}) {
  try {
    return toVerifyTokenType === 'access'
      ? {
          ...(await promisify(JWT.verify)(accessToken, secret)),
          refreshed: false
        }
      : {
          ...(await promisify(JWT.verify)(refreshToken, secret)),
          refreshed: false
        };
  } catch (err) {
    if (
      err instanceof JWT.TokenExpiredError &&
      toVerifyTokenType === 'access'
    ) {
      const decodedToken = await verifyToken({
        refreshToken,
        toVerifyTokenType: 'refresh',
        secret: process.env.JWT_REFRESH_SECRET,
        status: 401
      });
      if (!(await Session.checkSession(decodedToken.refreshSession))) {
        return next(new AppError('Invalid session. Please re-login.', status));
      }
      const accessToken = signAccessToken(
        decodedToken.id,
        decodedToken.userType
      );
      return { refreshed: true, accessToken, statusCode: 309 };
    } else if (
      err instanceof JWT.TokenExpiredError &&
      toVerifyTokenType === 'refresh'
    ) {
      return next(new AppError('Token expired. Please re-login.', status));
    } else if (err instanceof JWT.JsonWebTokenError) {
      return next(new AppError('Invalid Token', status));
    } else {
      return next(new AppError('An error occurred', status));
    }
  }
}

// exports.generateToken = catchAsyncError(async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1] || null;
//     if (!token) {
//         return next(
//             new AppError(
//                 'You are not logged in! Please log in to get access.',
//                 403
//             )
//         );
//     }
//     const decodedToken = await verifyToken(
//         token,
//         process.env.JWT_REFRESH_SECRET,
//         403
//     );

//     if (!(await Session.checkSession(decodedToken.refreshSession))) {
//         return next(new AppError('Invalid session. Please re-login.', 403));
//     }

//     const accessToken = signAccessToken(
//         decodedToken.id,
//         decodedToken.refreshSession
//     );
//     res.status(200).json({
//         status: 'success',
//         accessToken
//     });
// });

exports.signup = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    pass: req.body.pass,
    passConfirm: req.body.passConfirm,
    role: req.body.role
  });

  res.status(200).json({
    status: 'success',
    data: { newUser }
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, pass } = req.body;
  if (!email || !pass)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email }).select('+pass');
  if (!user) {
    return next(new AppError("user doesn't exists, sign up", 401));
  }
  if (!(await user.correctPassword(pass, user.pass))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  sendTokens(user, 'admin', 200, res, 'login');
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
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decodedToken = await verifyToken({
    accessToken,
    refreshToken,
    toVerifyTokenType: 'access',
    secret: process.env.JWT_ACCESS_SECRET,
    status: 401
  });

  if (decodedToken.refreshed) {
    res.setHeader(
      'Authorization',
      `Bearer ${decodedToken.accessToken} ${refreshToken}`
    );

    res.locals.statusCode = decodedToken.statusCode;
  }

  res.locals.userId = decodedToken.id;
  res.locals.userType = decodedToken.userType;
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
