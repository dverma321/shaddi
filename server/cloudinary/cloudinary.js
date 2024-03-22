require('dotenv').config()

const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: process.env.cloudinary_name, 
  api_key: process.env.cloudinary_apikey, 
  api_secret: process.env.cloudinary_secretkey 
});

console.log('Cloudinary Connected');


module.exports = cloudinary;
