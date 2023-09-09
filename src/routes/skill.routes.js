const express = require('express');
const authController = require('../controllers/auth.controller');
const skillController = require('../controllers/skill.controller.js');
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
//-------------------------------------------//
module.exports = router;
