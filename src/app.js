const express = require('express');
const morgan = require('morgan');
const path = require('path');

const AppError = require('./utils/appErrorsClass');
const globalErrorHandler = require('./controllers/errors.controller');

//--------------------------------//
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
//--------------------------------//
app.use('/api/v1/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello from the server side'
  });
});
//--------------------------------//
// app.use('/api/v1/users', usersRouter);

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
