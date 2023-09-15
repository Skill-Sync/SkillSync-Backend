const express = require('express');
const meetingsRouter = require('./meeting.routes');
const friendsRouter = require('./friend.routes');
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
//------------------------------------------//
const router = express.Router({ mergeParams: true });
//-------------Users Routes-----------------//
router.use('/meetings', meetingsRouter);
router.use('/friends', friendsRouter);

router.get('/relevantMentors', userController.getRelevantMentors);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
    '/updatePersonalData',
    userController.getMe,
    userController.UpdateMe
);
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
