const express = require('express');
const authController = require('../controllers/authController');
const meetingController = require('../controllers/meetingsController.js');
//-----------------------------------------//
const router = express.Router();
//-------------------Router----------------//
router
  .route('/')
  .get(meetingController.getAllMeetings)
  .post(authController.restrictTo('user'), meetingController.createMeeting);

router
  .route('/:id')
  .get(meetingController.getMeeting)
  .patch(meetingController.updateMeeting)
  .delete(meetingController.deleteMeeting);

router.get('MyMeetings', meetingController.getMyMeetings);
//-------------------------------------------//
module.exports = router;
