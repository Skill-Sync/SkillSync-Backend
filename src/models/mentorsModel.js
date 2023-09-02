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
        ref: 'courses'
      }
    ],
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    verified: {
      type: Boolean,
      default: false
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
mentorSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});
//-------------------------Export-----------------------//
const Mentor = mongoose.model('Mentor', mentorSchema);
module.exports = Mentor;
