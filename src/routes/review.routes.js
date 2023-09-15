const express = require('express');
const authController = require('../controllers/auth.controller');
const reviewController = require('../controllers/review.controller.js');
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

router.get('/:id', reviewController.getReview);

router.use(authController.restrictTo('user', 'admin'));
router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);
//-------------------------------------------//
module.exports = router;