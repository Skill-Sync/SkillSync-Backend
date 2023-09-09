const express = require('express');
const usersRouter = require('./user.routes');
const mentorsRouter = require('./mentor.routes');
//------------------------------------------//
const router = express.Router();
//---------------Admin Routes---------------//
router.use('/mentors', mentorsRouter);
router.use('/users', usersRouter);
//-------------------------------------------//
module.exports = router;
