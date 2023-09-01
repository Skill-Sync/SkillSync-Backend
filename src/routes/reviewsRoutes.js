const express = require('express');
const authController = require('./../controllers/authController');
const reviewsController = require('./../controllers/reviewsController');
//-------------------------------------------//
const router = express.Router({ mergeParams: true });
//------------------ROUTES-------------------//
router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(authController.restrictTo('user'), reviewsController.createReview);

router.get('/:id', reviewsController.getReview);

router
  .route('/:id')
  .use(authController.restrictTo('user', 'admin'))
  .patch(reviewsController.updateReview)
  .delete(reviewsController.deleteReview);
//-------------------------------------------//
module.exports = router;
