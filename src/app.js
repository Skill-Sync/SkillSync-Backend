const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const authRouter = require('./routes/auth.Routes');
const usersRouter = require('./routes/users.Routes');
const skillsRouter = require('./routes/skills.Routes');
const mentorsRouter = require('./routes/mentors.Routes');
const coursesRouter = require('./routes/courses.Routes');
const reviewsRouter = require('./routes/reviews.Routes');
const friendsRouter = require('./routes/friends.Routes');
const meetingsRouter = require('./routes/meetings.Routes');

const { isLogin } = require('./controllers/authController');
const globalErrorHandler = require('./controllers/controllerUtils/errorController');
//--------------------------------//
const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', 'public')));
//--------------------------------//
app.use('/api/v1/auth', authRouter);
app.use(isLogin);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/skills', skillsRouter);
app.use('/api/v1/mentors', mentorsRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/friends', friendsRouter);
app.use('/api/v1/meetings', meetingsRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    message: 'Invalid route, please check URL'
  });
});
//--------------------------------//
app.use(globalErrorHandler);
//--------------------------------//
module.exports = app;
