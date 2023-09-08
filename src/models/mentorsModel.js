const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
//------------------------------------------//
const mentorSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: 'mentor'
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
    identityCard: {
      type: String,
      required: [true, 'A mentor must provide an identity card']
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    about: {
      type: String,
      default: 'No description'
    },
    experience: [
      {
        type: String,
        default: 'No experience'
      }
    ],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    onboarding_completed: {
      type: Boolean,
      default: false
    },
    isVerified: {
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
mentorSchema.pre('save', function(next) {
  if (this.isNew) return next();
  this.onboarding_completed = true;
  next();
});

mentorSchema.pre('save', async function(next) {
  // Only run this function only when password got modified (or created)
  if (!this.isModified('pass')) return next();
  this.password = await bcrypt.hash(this.pass, 12);
  this.passwordConfirm = undefined;
});
//-------------------Query Middleware-------------------//
mentorSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});
//-------------------------Export-----------------------//
const Mentor = mongoose.model('Mentor', mentorSchema);
module.exports = Mentor;
