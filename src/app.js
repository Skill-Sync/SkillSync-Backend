const express = require('express');
const morgan = require('morgan');
const path = require('path');

const AppError = require('./utils/appErrorsClass');
const catchAsyncError = require('./utils/catchAsyncErrors');
const globalErrorHandler = require('./controllers/errors.controller');

//--------------------------------//
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
//--------------------------------//
// Main Routes
app.use('/api/v1/users', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello from the server side'
  });
});
// Handling invalid Routes
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Sorry, the page you are trying to access is not available`,
      404
    )
  );
});
//--------------------------------//
// Error Handling Middleware
app.use(globalErrorHandler);
//--------------------------------//
module.exports = app;
