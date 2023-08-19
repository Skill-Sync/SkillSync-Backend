const AppError = require('./../utils/appErrorsClass');
//-------------------------------------------//
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  return new AppError(
    `Duplicate field value: ${value}. Please use another value!`,
    400
  );
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
//-------------------------------------------//
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  } else {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  } else {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
};

const sendErrorTesting = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
};

//-------------------------------------------//
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

    sendErrorProd(error, req, res);
  } else if (process.env.NODE_ENV.trim() === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV.trim() === 'test') {
    sendErrorTesting(err, req, res);
  } else {
    console.log('Something went wrong on error handling middleware');
  }
};
