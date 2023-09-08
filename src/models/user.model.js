const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
//------------------------------------------//
const usersSchema = new mongoose.Schema(
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
        ref: 'Skill'
      }
    ],
    skillsLearned: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill'
        },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced'],
          default: 'beginner'
        }
      }
    ],
    onboarding_completed: {
      type: Boolean,
      default: false
    },
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
//-------------------Document Middleware-----------------//
usersSchema.pre('save', function(next) {
  if (this.isNew) return next();
  this.onboarding_completed = true;
  next();
});

usersSchema.pre('save', async function(next) {
  // Only run this function only when password got modified (or created)
  if (!this.isModified('pass')) return next();
  this.password = await bcrypt.hash(this.pass, 12);
  this.passwordConfirm = undefined;
});
//-------------------Query Middleware-------------------//
usersSchema.pre(/^find/, function(next) {
  this.select('photo name email isEmployed skillsToLearn skillsLearned');
  this.find({ active: { $ne: false } });
  next();
});
//-------------------------Export-----------------------//
const User = mongoose.model('User', usersSchema);
module.exports = User;
