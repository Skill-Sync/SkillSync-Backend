const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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
            type: String
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
        skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'skill'
        },
        requestLetter: {
            type: String,
            trim: true,
            default: 'No request letter'
        },
        onboarding_completed: {
            type: Boolean,
            default: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: false,
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
//-------------------Instance Methods-------------------//
mentorSchema.methods.correctPassword = async function(loginPass, userPass) {
    return await bcrypt.compare(loginPass, userPass);
};

mentorSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 5 * 60 * 1000;
    return resetToken;
};
//-------------------Document Middleware-----------------//
mentorSchema.pre('save', function(next) {
    if (this.isNew) return next();
    this.onboarding_completed = true;
    next();
});

mentorSchema.pre('save', async function(next) {
    // Only run this function only when password got modified (or created)
    if (!this.isModified('pass')) return next();
    this.pass = await bcrypt.hash(this.pass, 12);
    this.passConfirm = undefined;
});
//-------------------Query Middleware-------------------//
mentorSchema.pre(/^find/, function(next) {
    this.select(
        'photo name email about experience courses onboarding_completed active role skill'
    );
    this.find({ active: { $ne: false } });
    next();
});
//-------------------------Export-----------------------//
const Mentor = mongoose.model('Mentor', mentorSchema);
module.exports = Mentor;
