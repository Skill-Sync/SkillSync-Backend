const express = require('express');
const coursesRouter = require('./courses.Routes');
const meetingsRouter = require('./meetings.Routes');
const authController = require('../controllers/authController');
const mentorController = require('../controllers/mentorsController');
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
  .delete(mentorController.deleteMentor)
  .patch('/activateMe', mentorController.activateMentor);
//-------------------------------------------//
module.exports = router;
