const mongoose = require('mongoose');
//-------------------Schema----------------//
// Please note that we intentionally did not create a 'friends' model with a user and an array of his friends. This decision aligns with our app's logic, where becoming friends with someone is based on mutual consent without requiring any requests or approvals. we know this approach may not be the best for scalability, but it is just a way to go for now."

const friendshipsSchema = new mongoose.Schema({
  user_1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user_2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['notStarted', 'pending', 'accepted', 'rejected'],
    default: 'notStarted'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date
  }
});
//-------------------------Export-----------------------//
const FriendShip = mongoose.model('FriendShip', friendshipsSchema);
module.exports = FriendShip;
