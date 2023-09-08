const express = require('express');
const coursesRouter = require('./course.routes');
const meetingsRouter = require('./meeting.routes');
const authController = require('../controllers/auth.controller');
const mentorController = require('../controllers/mentor.controller');
//------------------------------------------//
const router = express.Router();
//-------------Users Routes-----------------//
router.use('/courses', coursesRouter);
router.use('/meetings', meetingsRouter);

router
  .use(mentorController.getMe)
  .get('/me', mentorController.getMentor)
  .delete('/deactivateMe', mentorController.deactivateMentor);
router.patch('/updatePersonalData', mentorController.UpdateMe);
// router.patch('/updatePassword', authController.updatePassword);
//---------------Admin Routes---------------//
router.use(authController.restrictTo('admin'));
router.get('/', mentorController.getAllMentors);
router.get('/mentorsRequests', mentorController.getMentorsReq);
router.patch('/verifyMentor/:id', mentorController.verifyMentor);
router
  .route('/:id')
  .get(mentorController.getMentor)
  .delete(mentorController.deleteMentor);
router.patch('/activateMe', mentorController.activateMentor);
//-------------------------------------------//
module.exports = router;
