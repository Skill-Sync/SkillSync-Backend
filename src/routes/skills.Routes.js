const express = require('express');
const authController = require('../controllers/authController');
const skillController = require('../controllers/skillsController.js');
//-----------------------------------------//
const router = express.Router();
//-------------------Router----------------//
router
  .get('/', skillController.getAllSkills)
  .get('/:id', skillController.getSkill);

router.use(authController.restrictTo('admin'));
router
  .post('/', skillController.createSkill)
  .patch('/:id', skillController.updateSkill)
  .delete('/:id', skillController.deleteSkill);
//-----------------------------------------//
module.exports = router;
