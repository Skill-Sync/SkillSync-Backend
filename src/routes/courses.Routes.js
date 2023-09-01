const express = require('express');
const CourseController = require('./../controllers/CoursesController');
const authController = require('../controllers/authController');
const reviewsRouter = require('./reviews.Routes');
//-----------------------------------------//
const router = express.Router();
//-------------------Router----------------//
router.use('/:tourID/reviews', reviewsRouter);

router
  .route('/')
  .get(CourseController.getAllCourses)
  .post(CourseController.createCourse);

router
  .route('/:id')
  .get(CourseController.getCourse)
  .patch(CourseController.updateCourse)
  .delete(CourseController.deleteCourse);
//-----------------------------------------//
module.exports = router;
