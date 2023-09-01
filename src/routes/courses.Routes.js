const express = require('express');
const reviewsRouter = require('./reviews.Routes');
const authController = require('../controllers/authController');
const CourseController = require('../controllers/CoursesController.js');
//-----------------------------------------//
const router = express.Router();
//-------------------Router----------------//
router.use('/:courseID/reviews', reviewsRouter);

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
