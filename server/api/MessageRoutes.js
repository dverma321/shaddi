const express = require('express');
const router = express.Router();
const Message = require('../model/Message');
const authenticate = require('../middleware/authentication.js');

// Get messages between two users
router.get('/messages/:userId/:friendId', authenticate, async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Save a new message
router.post('/messages', authenticate, async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Error saving message' });
  }
});

module.exports = router;
