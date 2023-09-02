const express = require('express');
const coursesRouter = require('./courses.Routes');
const authController = require('../controllers/authController');
const mentorController = require('../controllers/mentorsController');
//------------------------------------------//
const router = express.Router();
//-------------Users Routes-----------------//
router.use('/courses', coursesRouter);

router
  .use(mentorController.getMe)
  .get('/me', mentorController.getUser)
  .patch('/activateMe', mentorController.activateUser)
  .delete('/deactivateMe', mentorController.deactivateUser);

router.patch('/updatePersonalData', mentorController.UpdateMe);
router.patch('/updatePassword', authController.updatePassword);
//---------------Admin Routes---------------//
router.use(authController.restrictTo('admin'));
router.get('/', mentorController.getAllUsers);
router
  .route('/:id')
  .get(mentorController.getUser)
  .patch(mentorController.activateUser)
  .delete(mentorController.deactivateUser);
//-------------------------------------------//
module.exports = router;
