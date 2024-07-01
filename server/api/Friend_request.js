const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path');  // Add this line to import the 'path' module
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const moment = require('moment'); // for Date Format
const cors = require('cors');
const fs = require('fs');

const authenticate = require('../middleware/authentication');

const router = express.Router()


const User = require('../model/User')
const FriendRequest = require('../model/FriendRequest'); // Import the FriendRequest model

// Accept a friend request

router.post('/accept-request', authenticate, async (req, res) => {
    const { requestId } = req.body;
    try {
      const request = await FriendRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
  
      const sender = await UserData.findById(request.sender);
      const recipient = await UserData.findById(request.recipient);
  
      if (!sender || !recipient) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add each other as friends
      sender.friends.push(recipient._id);
      recipient.friends.push(sender._id);
  
      await sender.save();
      await recipient.save();
  
      // Update the status of the friend request
      request.status = 'accepted';
      await request.save();
  
      res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
      res.status(500).json({ message: 'Error accepting friend request', error });
    }
  });
  

  // Reject friend request
router.post('/reject-request', authenticate, async (req, res) => {
    const { requestId } = req.body;
  
    try {
      // Find the friend request and update its status to 'rejected'
      await FriendRequest.findByIdAndUpdate(requestId, { status: 'rejected' });
  
      res.status(200).json({ message: 'Friend request rejected successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error rejecting friend request', error });
    }
  });

  // Fetch the list of friends for a user

  router.get('/friends/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Assuming you have a 'friends' field in User schema that holds an array of user IDs
      const user = await User.findById(userId).populate('friends', 'name imageUrl');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user.friends);
    } catch (error) {
      console.error('Error fetching friends:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  



module.exports = router
