const mongoose = require('mongoose');
//-------------------Schema----------------//
const meetingsSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['not-selected', 'pending', 'accepted', 'rejected'],
    default: 'not-selected'
  },
  scheduledDate: {
    type: Date,
    required: [true, 'A meeting must have a scheduled date']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
//-------------------Query Middleware----------------//
meetingsSchema.pre(/^find/, function(next) {
  this.select('mentor user status scheduledDate');
  next();
});
//-------------------------Export-----------------------//
const Meeting = mongoose.model('Meeting', meetingsSchema);
module.exports = Meeting;
