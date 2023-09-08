const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const hpp = require('hpp');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const { isLogin } = require('./controllers/auth.controller');
const globalErrorHandler = require('./controllers/controllerUtils/errorController');

const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/user.routes');
const adminRouter = require('./routes/admin.routes');
const skillsRouter = require('./routes/skill.routes');
const mentorsRouter = require('./routes/mentor.routes');
const coursesRouter = require('./routes/course.routes');
const reviewsRouter = require('./routes/review.routes');
const friendsRouter = require('./routes/friend.routes');
const meetingsRouter = require('./routes/meeting.routes');
//--------------------------------//
const app = express();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cors());
app.options('*', cors());

// Set security HTTP headers
// app.use(helmet.contentSecurityPolicy({}));

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Payment webhook, BEFORE body-parser, because it needs the body as stream
// app.post('/webhook-checkout', bodyParser.raw({ type: 'application/json' }));

// Body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(hpp());
//--------------------------------//
app.use('/api/v1/auth', authRouter);
app.use(isLogin);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/admin', adminRouter);
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
