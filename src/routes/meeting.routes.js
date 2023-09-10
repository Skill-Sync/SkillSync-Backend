const express = require('express');
const authController = require('../controllers/auth.controller');
const meetingController = require('../controllers/meeting.controller.js');
//-----------------------------------------//
const router = express.Router({ mergeParams: true });
//-------------------Router----------------//
router.route('/').get(meetingController.getMyMeetings);

router
  .route('/:id')
  .get(meetingController.getMeeting)
  .patch(authController.restrictTo('user'), meetingController.createMeeting)
  .post(authController.restrictTo('mentor'), meetingController.updateMeeting);
//-------------------------------------------//
module.exports = router;
