const express = require('express');
const coursesRouter = require('./courses.Routes');
const meetingsRouter = require('./meetings.Routes');
const friendsRouter = require('./friends.Routes');
const authController = require('../controllers/authController');
const userController = require('../controllers/usersController');
//------------------------------------------//
const router = express.Router();
//-------------Users Routes-----------------//
router.use('/courses', coursesRouter);
router.use('/meetings', meetingsRouter);
router.use('/friends', friendsRouter);

router
  .use(userController.getMe)
  .get('/me', userController.getUser)
  .delete('/deactivateMe', userController.deactivateUser);
router.patch('/updatePersonalData', userController.UpdateMe);
// router.patch('/updatePassword', authController.updatePassword);
//---------------Admin Routes---------------//
router.use(authController.restrictTo('admin'));
router.get('/', userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);
router.patch('/activateMe', userController.activateUser);
//-------------------------------------------//
module.exports = router;
