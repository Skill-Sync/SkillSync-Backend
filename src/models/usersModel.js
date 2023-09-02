const mongoose = require('mongoose');
const validator = require('validator');
//------------------------------------------//
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    name: {
      type: String,
      required: [true, 'A user must have a name']
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email'
      },
      required: [true, 'A user must have an email']
    },
    pass: {
      type: String,
      required: [true, 'A user must have a password'],
      minlength: 8,
      select: false
    },
    passConfirm: {
      type: String,
      validate: {
        validator: function(el) {
          return el === this.pass;
        },
        message: 'Passwords are not the same!'
      },
      required: [true, 'A user must have a password confirmation']
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    about: {
      type: String,
      default: 'No description'
    },
    isEmployed: {
      type: Boolean,
      default: false
    },
    skillsToLearn: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skills'
      }
    ],
    skillsLearned: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skills'
        },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced'],
          default: 'beginner'
        }
      }
    ],
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//-------------------Query Middleware-------------------//
userSchema.pre(/^find/, function(next) {
  this.select('photo name email isEmployed skillsToLearn skillsLearned');
  this.find({ active: { $ne: false } });
  next();
});
//-------------------------Export-----------------------//
const User = mongoose.model('User', userSchema);
module.exports = User;
