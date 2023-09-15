const express = require('express');
const meetingsRouter = require('./meeting.routes');
const authController = require('../controllers/auth.controller');
const mentorController = require('../controllers/mentor.controller');
//------------------------------------------//
const router = express.Router({ mergeParams: true });
//-------------Users Routes-----------------//
router.use('/meetings', meetingsRouter);

router.get('/me', mentorController.getMe, mentorController.getMentor);
router.patch(
    '/updatePersonalData',
    mentorController.getMe,
    mentorController.UpdateMe
);
router.post(
    '/set-working-hours',
    mentorController.getMe,
    mentorController.setWorkingHours
);
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
