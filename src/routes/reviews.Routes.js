const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewsController.js');
//-------------------------------------------//
const router = express.Router({ mergeParams: true });
//------------------ROUTES-------------------//
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setCourseUserId,
    reviewController.createReview
  );

router.route('/:id').get(reviewController.getReview);

router.use(authController.restrictTo('user', 'admin'));
router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);
//-------------------------------------------//
module.exports = router;
