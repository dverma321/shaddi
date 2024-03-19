const mongoose =  require('mongoose')
const jwt = require('jsonwebtoken'); // Import jsonwebtoken


const Schema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
    gender: String,
    phone: Number,
    isAdmin: Boolean,
    verified: Boolean,

    // user update profile schema

    country: String,
    state: String,
    city: String,
    pincode: String,   
    alternateMobileNumber: Number,

    // personal Data 

    dob: String,    
    height: Number,
    weight: Number,
    community: String,
    caste: String,    
    bodyColor: String,
    drink: String,
    smoke: String,
    food: String,
    hobbies: [String],


    // work Data

    work: String,    
    professionalStatus: String,
    salary: Number,

    // image upload , if error like jwt token is undefined then comment image

    image: {
        type: String,        
    },  
   

    tokens : [
        {
            token: {
                type: String,
                require: true
            }
        }

    ]
    
})

// we are generating token

Schema.methods.generateAuthToken = async function()
{
    try{
        let token = jwt.sign(
              {
                _id:this._id
                
              },
              process.env.JWT_SECRET
             
            ); // token generated

            this.tokens = this.tokens.concat({token:token}); // token stored in the database

            await this.save();

            return token;
    }
    catch(err){
        console.log("Catch Error :", err);

    }
}

const User = mongoose.model('UserData', Schema);
module.exports = User