const express = require('express');
const { isLogin } = require('../controllers/auth.controller');
const authController = require('../controllers/auth.controller');
const skillController = require('../controllers/skill.controller.js');
const app = require('../app');
//-----------------------------------------//
const router = express.Router();
//-------------------Router----------------//
router
  .get('/', skillController.getAllSkills)
  .get('/:id', skillController.getSkill);

app.use(isLogin);
router.use(authController.restrictTo('admin'));
router
  .post('/', skillController.createSkill)
  .patch('/:id', skillController.updateSkill)
  .delete('/:id', skillController.deleteSkill);
//-------------------------------------------//
module.exports = router;
