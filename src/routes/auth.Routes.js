const express = require('express');
const authController = require('./../controllers/auth.controller');
//------------------------------------------//
const router = express.Router();
//-------------Auth Routes-----------------//
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/confirmEmail/:token', authController.confirmEmail);
router.post('/forgotPass', authController.forgotPassword);

router
    .route('/resetPass/:token')
    .get(authController.getResetToken)
    .patch(authController.resetPassword);

router.use(authController.isLogin);
router.get('/logout', authController.logout);
//-------------------------------------------//
module.exports = router;
