const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/usersController');
//------------------------------------------//
const router = express.Router();
//-------------Users Routes-----------------//
router.use(authController.isLogin);

router.get('/test', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: req.user
  });
});
module.exports = router;
