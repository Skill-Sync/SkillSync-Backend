const mongoose = require('mongoose');
//-------------------Schema----------------//
const reviewsSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'A review must have a rating']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'A review must belong to a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must belong to a user']
  }
});
//----------------------Indexing-----------------------//
reviewsSchema.index({ tour: 1, user: 1 }, { unique: true });
//---------------Queries Middleware--------------------//
reviewsSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo -_id'
  });
  next();
});
//---------------------Static Method-------------------//
// calculate the average rating of a course
reviewsSchema.statics.calcAverageRatings = async function(courseID) {};
//--------------------Document hook--------------------//
reviewsSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.tour);
});
//-------------------------Export-----------------------//
const Review = mongoose.model('Review', reviewsSchema);
module.exports = Review;
