const express = require('express');
const coursesRouter = require('./course.routes');
const meetingsRouter = require('./meeting.routes');
const authController = require('../controllers/auth.controller');
const mentorController = require('../controllers/mentor.controller');
//------------------------------------------//
const router = express.Router({ mergeParams: true });
//-------------Users Routes-----------------//
router.use('/courses', coursesRouter);
router.use('/meetings', meetingsRouter);

router
  .get('/me', mentorController.getMe, mentorController.getMentor)
  .delete(
    '/deactivateMe',
    mentorController.getMe,
    mentorController.deactivateMentor
  );
router.patch('/updatePersonalData', mentorController.UpdateMe);
// router.patch('/updatePassword', authController.updatePassword);
//---------------Admin Routes---------------//
// router.use(authController.restrictTo('admin'));
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
