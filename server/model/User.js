const mongoose =  require('mongoose')

const Schema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
    gender: String,
    phone: Number,
    isAdmin: Boolean,
    verified: Boolean,

    tokens : [
        {
            token: {
                type: String,
                require: true
            }
        }

    ]
    // image: String


    // dob: Date,   
    // country: String,
    // state: String,
    // city: String,
    // pincode: String,   
    // alternateMobileNumber: Number,

    // personal Data
    
    // height: Number,
    // weight: Number,
    // faceColor: String,
    // hobbies: [String],
    // work: String,
    // income: Number,
    // photo: {
    //     data: Buffer,  // Binary data of the image
    //     contentType: String  // MIME type of the image (e.g., 'image/jpeg', 'image/png')
    // }

})

const User = mongoose.model('UserData', Schema);
module.exports = User