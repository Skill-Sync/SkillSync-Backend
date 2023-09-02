const mongoose = require('mongoose');
//------------------------------------------//
const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: process.env.SESSION_EXPIRATION || 60 * 60 * 24 * 30
  },
  valid: {
    type: Boolean,
    default: true
  }
});
//--------------------Static Methods--------------------//
sessionSchema.statics.invalidateSession = async function(userId) {
  this.findOneAndUpdate({ user: userId }, { valid: false });
};
sessionSchema.statics.createSession = async function(userId) {
  return await this.create({ user: userId });
};
sessionSchema.statics.checkSession = async function(sessionId) {
  const session = await this.findById(sessionId);
  return session.valid;
};
sessionSchema.statics.deleteSession = async function(sessionId) {
  this.find(sessionId).deleteOne();
};
sessionSchema.statics.invalidateSAllSessions = async function(userId) {
  await this.find({ user: userId, valid: true }).updateMany({ valid: false });
};
//-------------------------Export-----------------------//
const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
