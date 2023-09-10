const express = require('express');
const authController = require('../controllers/auth.controller');
const meetingController = require('../controllers/meeting.controller.js');
//-----------------------------------------//
const router = express.Router({ mergeParams: true });
//-------------------Router----------------//
router
  .route('/')
  .get(meetingController.getMyMeetings)
  .post(authController.restrictTo('mentor'), meetingController.updateMeeting);

router
  .route('/:id')
  .get(meetingController.getMeeting)
  .post(authController.restrictTo('user'), meetingController.createMeeting);
//-------------------------------------------//
module.exports = router;
