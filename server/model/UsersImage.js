const mongoose = require('mongoose');

const userImageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },

  
})

const UsersImages = mongoose.model('Image', userImageSchema);

module.exports = UsersImages