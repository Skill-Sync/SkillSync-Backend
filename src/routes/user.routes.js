const express = require('express');
const coursesRouter = require('./course.routes');
const meetingsRouter = require('./meeting.routes');
const friendsRouter = require('./friend.routes');
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
//------------------------------------------//
const router = express.Router({ mergeParams: true });
//-------------Users Routes-----------------//
router.use('/courses', coursesRouter);
router.use('/meetings', meetingsRouter);
router.use('/friends', friendsRouter);

router
  .get('/me', userController.getMe, userController.getUser)
  .delete('/deactivateMe', userController.getMe, userController.deactivateUser);

router.patch('/updatePersonalData', userController.UpdateMe);
// router.patch('/updatePassword', authController.updatePassword);
//---------------Admin Routes---------------//
// router.use(authController.restrictTo('admin'));
router.get('/', userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);
router.patch('/activateMe', userController.activateUser);
//-------------------------------------------//
module.exports = router;
