const express = require('express');
const usersRouter = require('./users.Routes');
const mentorsRouter = require('./mentors.Routes');
//------------------------------------------//
const router = express.Router();
//---------------Admin Routes---------------//
router.use('/mentors', mentorsRouter);
router.use('/users', usersRouter);
//-------------------------------------------//
module.exports = router;
