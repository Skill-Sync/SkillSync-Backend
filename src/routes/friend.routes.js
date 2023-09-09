const express = require('express');
const friendsController = require('../controllers/friend.controller');
//------------------------------------------//
const router = express.Router({ mergeParams: true });
//-------------Users Routes-----------------//
router.get('/', friendsController.getMyFriends);

router
  .route('/:id')
  .get(friendsController.getFriend)
  .post(friendsController.acceptAsFriend)
  .delete(friendsController.deleteFriend);
//-------------------------------------------//
module.exports = router;
