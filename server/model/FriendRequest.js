const mongoose = require('mongoose')

const friendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
  imageUrl: { type: String,  required: true  }, // Make sure imageUrl is required if necessary
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
