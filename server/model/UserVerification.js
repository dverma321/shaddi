const mongoose =  require('mongoose')

const VerificationSchema = mongoose.Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,    
    expiresAt: Date,
    verified: Boolean


})

const UserVerification = mongoose.model('UserVerification', VerificationSchema);
module.exports = UserVerification