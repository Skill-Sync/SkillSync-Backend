const express = require('express');
const reviewsRouter = require('./reviews.Routes');
const authController = require('../controllers/authController');
const CourseController = require('../controllers/coursesController.js');
//-----------------------------------------//
const router = express.Router({ mergeParams: true });
//-------------------Router----------------//
router.use('/:courseID/reviews', reviewsRouter);

router
  .route('/')
  .get(CourseController.getAllCourses)
  .post(authController.restrictTo('mentor'), CourseController.createCourse);

router
  .route('/:id')
  .get(CourseController.getCourse)
  .patch(CourseController.updateCourse)
  .delete(CourseController.deleteCourse);

router
  .get('MyCourses', CourseController.getMyCourses)
  .get('RelatedCourses', CourseController.getRelatedCourses);
//-------------------------------------------//
module.exports = router;
