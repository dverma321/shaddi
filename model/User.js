const mongoose =  require('mongoose')

const Schema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dob: Date,

})

const User = mongoose.model('UserData', Schema);
module.exports = User