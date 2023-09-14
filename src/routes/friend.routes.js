const express = require('express');
const userController = require('../controllers/user.controller');
const friendsController = require('../controllers/friend.controller');
//------------------------------------------//
const router = express.Router({ mergeParams: true });
//-------------Users Routes-----------------//
router.get('/', friendsController.getMyFriends);

router
    .route('/:id')
    .get(userController.getUser)
    .delete(friendsController.deleteFriend)
    .post(friendsController.createEditFriendship);
//-------------------------------------------//
module.exports = router;
