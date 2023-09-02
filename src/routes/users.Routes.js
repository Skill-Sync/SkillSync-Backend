const express = require('express');
const coursesRouter = require('./courses.Routes');
const authController = require('../controllers/authController');
const userController = require('../controllers/usersController');
//------------------------------------------//
const router = express.Router();
//-------------Users Routes-----------------//
router.use('/courses', coursesRouter);

router
  .use(userController.getMe)
  .get('/me', userController.getUser)
  .patch('/activateMe', userController.activateUser)
  .delete('/deactivateMe', userController.deactivateUser);

router.patch('/updatePersonalData', userController.UpdateMe);
router.patch('/updatePassword', authController.updatePassword);
//---------------Admin Routes---------------//
router.use(authController.restrictTo('admin'));
router.get('/', userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.activateUser)
  .delete(userController.deactivateUser);
//-------------------------------------------//
module.exports = router;
