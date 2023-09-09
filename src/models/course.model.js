const mongoose = require('mongoose');
//------------------------------------------//
const coursesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A course must have a name']
  },
  description: {
    type: String,
    required: [true, 'A course must have a description']
  },
  sessionPrice: {
    type: Number,
    default: 8,
    required: [true, 'A course must have a price']
  },
  sessionDuration: {
    type: Number,
    default: 1,
    required: [true, 'A course must have a duration']
  },
  ratingAverage: {
    type: Number,
    default: 0
  },
  SessionsNumber: {
    type: Number,
    default: 0
  },
  skillsInvolved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    }
  ]
});
//-------------------------Export-----------------------//
const Course = mongoose.model('Course', coursesSchema);
module.exports = Course;
