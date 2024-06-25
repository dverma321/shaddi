const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path');  // Add this line to import the 'path' module
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const moment = require('moment'); // for Date Format
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');

const authenticate = require('../middleware/authentication');

const router = express.Router()

router.use(cors(
    {
        origin:"https://findyourperfectmatch.netlify.app",
        methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // set the cookie true
        optionsSuccessStatus: 204     // Respond with a 204 status code for preflight requests
    }
));

//getting User 

const User = require('../model/User')


// user verification
const UserVerification = require('../model/UserVerification')

// email handler

const nodemailer = require('nodemailer')

// unique string

const { v4: uuidv4 } = require('uuid')

// .env variable

require('dotenv').config()

// nodemailer stuff for that you have to enable app password in the gmail and it will generate random password for your account

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {

    user: process.env.Auth_mail,
    pass: process.env.Email_pass,

  }
})

// Testing Success

transporter.verify((error, success) => {
  if (error) {
    console.log("Transporter Error : ", error)
  }
  else {
    console.log("Ready for message");
    console.log(success);
  }
})

// signup with email verification 

router.post("/signup", (req, res) => {

  let { name, email, password, confirmPassword, gender } = req.body.user;

  name = name.trim();
  email = email.trim();
  gender = gender.trim();
  
  password = password.trim();
  confirmPassword = confirmPassword.trim();  

    
  if (name === "" || email === "" || password === "" || confirmPassword === "" || gender === "" ) {
    return res.json({
      status: "FAILED",
      message: "Input Fields must be filled"
    });
  }

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.json({
      status: "403",
      message: "Invalid Email Entered"
    });
  }

  // if (!new Date(dob).getTime()) {
  //     return res.json({
  //         status: "FAILED",
  //         message: "Invalid Date of Birth Entered"
  //     });
  // }

  if (password.length < 8) {
    return res.json({
      status: "402",
      message: "Password length is too short"
    });
  }


  if (password !== confirmPassword) {
    return res.json({
      status: "401",
      message: "Passwords do not match"
    });
  }


  // checking if email already exists or not
  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        return res.json({
          status: "404",
          message: "Email Already Exists..."
        });
      }


      // password handler
      const saltRounds = 10;

      bcrypt.hash(confirmPassword, saltRounds)
        .then(hashedPassword => {
          const newUser = new User({
            name,
            email,
            password: hashedPassword ,
            confirmPassword: hashedPassword,
            gender,            
            verified: false,
            isAdmin: false,


            // dob,                       
            // country,
            // state,
            // city,
            // pincode,
            // height,
            // weight,
            // faceColor,
            // hobbies,
            // work,
            // income,
            // alternateMobileNumber
          });

          newUser.save()
            .then(result => {
              // send verification Email
              sendVerificationEmail(result, res);
            })
            .catch(err => {
              console.error("Error during user creation:", err);
              res.json({
                status: "FAILED",
                message: "An Error Occurred while Creating a new User: " + err.message
              });
            });
        })
        .catch(err => {
          console.log("An Error occurred while Hashing the password:", err);
          res.json({
            status: "FAILED",
            message: "An Error occurred while Hashing the password"
          });
        });

    })

    .catch(err => {
      console.log("Email Checking:", err);
      res.json({
        status: "FAILED",
        message: "An Error occurred while checking the existing Email"
      });
    });




})


// Testing purpose Signup Automatically Login After Registration Successful

router.post('/signup_withloginautomatically', async (req, res, next) => {
  try {
    // Extract user data from request body
    const { name, email, gender, password, confirmPassword } = req.body.user;

    // Validate required fields
    if (!name || !email  || !gender || !password || !confirmPassword) {
      return res.status(400).json({ status: 'FAILED', message: 'Please fill all the fields' });
    }

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'FAILED', message: 'Email already exists' });
    }

    // Create a new user object with a timestamp
    const timestamp = new Date();

    // Create a new user object
    const newUser = new User({ name, email, gender, password, confirmPassword, createdAt: timestamp });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // login after successfully signup below code

    if (savedUser) {
      const token = await savedUser.generateAuthToken(); // here token is generating from this function which already declared in the model schema
      console.log("Retrieve Token from database: ", token);

      // storing token in the cookie

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        credentials: 'include'
      });


      // Send success response

      res.status(200).json({ status: 'SUCCESS', message: 'User registered successfully', token, userId: savedUser._id });

    }
    else {
      res.status(500).json({ status: 'FAILED', message: 'User not registered ' });


    }

  } catch (error) {
    // Log and send error response
    console.error('Error during registration:', error);
    res.status(500).json({ status: 'FAILED', message: 'Internal server error' });
  }
});


// send verification Email

const sendVerificationEmail = ({ _id, email }, res) => {


  // url to be used in the email current local and after hosting  use hosting website url
  const currentUrl = "https://shaddi.onrender.com/"; // choose render url while online
  const uniqueString = uuidv4() + _id;

  // create mail options
  const mailOptions = {
    from: process.env.Auth_mail,
    to: email,
    subject: "Verfify Your Email",
    html: `<p>Please verify your email to continue the signup process</p><p>This link will <b>expire in 6 hours</b></p><p>press <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}>here</a>to proceed</p>`
  }

  // hash the unique string

  const saltRound = 10;

  bcrypt.hash(uniqueString, saltRound)
    .then((hashedUniqueString) => {

      // set value in userverfication collection model

      const newVerfication = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000   // (6 hours = 6*60*60*1000)

      })

      newVerfication.save()
        .then(() => {

          transporter.sendMail(mailOptions)
            .then(() => {
              res.json({
                status: "PENDING",
                message: "Verification Email Sent"
              })
            })
            .catch(err => {
              res.json({
                status: "FAILED",
                message: "Email Verification Failed"
              })
            })
        })
        .catch(err => {
          res.json({
            status: "FAILED",
            message: "Error while setting the value in UserVerification Model"
          })
        })


    })
    .catch(err => {

      console.log("Error while Hashing the Email Data! ", err);

      res.json({
        status: "FAILED",
        message: "Error while Hashing the Email Data!"
      })

    })
}

// verify Email

router.get("/verify/:userId/:uniqueString", (req, res) => {

  let { userId, uniqueString } = req.params

  UserVerification.find({ userId })
    .then((result) => {

      if (result.length > 0) {
        // user verification record exists so we can proceed here

        const { expiresAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;

        // checking for expired uniqueString

        if (expiresAt < Date.now()) {

          // record has expired so we delete it

          console.error("Verification link expired");
          UserVerification.deleteOne({ userId })
            .then(result => {
              User.deleteOne({ _id: userId })
                .then(() => {
                  let message = "Linked has expired or please signup again ";
                  res.redirect(`/user/verified?error=true&message=${encodeURIComponent(message)}`);

                })
                .catch(err => {
                  console.log(err);
                  let message = "Clearing User with expired uniqueString Failed ";
                  res.redirect(`/user/verified?error=true&message=${encodeURIComponent(message)}`);

                })
            })
            .catch(err => {
              console.log(err);
              let message = "An Error Occured while clearing expired user verification Record";
              res.redirect(`/user/verified?error=true&message=${encodeURIComponent(message)}`);


            })
        }

        // valid user record exists so we validate the uniqueString
        else {

          // First compare the hashed unique string

          bcrypt.compare(uniqueString, hashedUniqueString)
            .then(result => {
              if (result) {
                // string matched
                User.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    UserVerification.deleteOne({ userId })
                      .then(() => {
                        res.sendFile(path.join(__dirname, "./../views/verified.html"));
                      })
                      .catch(err => {
                        let message = "Error occured while finalizing successful verification";
                        res.redirect(`/user/verified?error=true&message=${encodeURIComponent(message)}`);


                      })
                  })
                  .catch(err => {
                    let message = "Error occured while updating user record to show verified";
                    res.redirect(`/user/verified?error=true&message=${encodeURIComponent(message)}`);


                  })
              }
              else {
                // existing record but incorrect verification detail
                let message = "Invalid Verification Details Passed";
                res.redirect(`/user/verified?error=true&message=${encodeURIComponent(message)}`);

              }
            })
            .catch(err => {
              console.log("Error While Comparing unique String value ", err);
              let message = "Error While Comparing unique String value";
              res.redirect(`/user/verified?error=true&message=${encodeURIComponent(message)}`);

            }
            )

        }


      }


      else {
        // user verification record doesn't exit

        let message = "Accont Record doesn't exits or already verified. please signup or login";
        res.redirect(`/user/verified/error=true&message=${message}`);
      }
    })
    .catch(err => {
      console.log(err);
      let message = "An Error occured while checking for existing userId in the Userverification record";
      res.redirect(`/user/verified/error=true&message=${message}`);
    })

});




//verified page route

// Add a route handler for /verified
router.get("/verified", (req, res) => {
  const { error, message } = req.query;

  // Now you can handle the error and message as needed
  if (error === "true") {
    console.error("Verification error:", message);
    // Handle the error accordingly (e.g., display an error message on the page)
  }

  // Render the appropriate response or page
  res.sendFile(path.join(__dirname, "./../views/verified.html"));
});


// Testing purpose signin

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "FAILED",
      message: "Email and password are required."
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "FAILED",
        message: " Email is not registered."
      });
    }

    // Check if user is verified
    
    if (!user.verified) {
      return res.status(402).json({
        status: "FAILED",
        message: "User is not verified. Please verify your account."
      });
    }

    // if (user.password !== password) {
    //   return res.status(403).json({
    //     status: "FAILED",
    //     message: "Invalid credentials."
    //   });
    // }

        // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(403).json({
          status: "FAILED",
          message: "Invalid credentials."
        });
      }

    // Generating Token after login

    const token = await user.generateAuthToken();
    console.log("Retrieve Token from database: ", token);

    // storing token in the cookie

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      credentials: 'include'
    });


    res.status(200).json({
      status: "SUCCESS",
      message: "Login successful.",
      token,
      userId: user._id
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred during login."
    });
  }
});


// Logout route

router.get('/logout', (req, res) => {
  // Simply clear the token on the client side
  res.clearCookie('jwtoken', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    credentials: 'include'
  })
  req.rootUser = null;
  console.log("user logout successfully...");

  res.json({
    status: "SUCCESS",
    message: "Logout Successful"
  });
});


// getData route


router.get("/getData", authenticate, async (req, res) => {
  try {
    console.log("/getData route has been called");

    // Accessing rootUser from the request object
    const rootUser = req.rootUser;

    res.send(rootUser);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Something went wrong while fetching data');
  }
});

// all users route

router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Query all users from the User collection

    res.json(users); // Send the users data as a JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Something went wrong while fetching users' });
  }
});

// myprofile route

router.post('/updateProfile', authenticate, async (req, res) => {
  try {
    console.log("update profile route has been called");
    // Extract profile data from the request body
    const { country, state, city, food, drink, smoke, bodyColor, height, weight, professionalStatus, work, salary, caste, dob, community } = req.body;

    // Get userId from the authenticated user middleware i.e if you are login then your information is stored in rootUser

    const userId = req.rootUser._id;
    console.log("Login User ID : ", userId);

    // Find the user profile data in the UserProfileData model

    const userProfile = await User.findOne({ _id: userId });
    console.log("User Found : ", userProfile);

    if (!userProfile) {
      return res.status(404).json({ status: 'FAILED', message: 'User profile not found' });
    }

    // Convert the dob to the desired format DD-MM-YYYY using moment.js
    const formattedDOB = moment(dob).format('DD-MM-YYYY');


    //   // Update the user profile data
    userProfile.country = country;
    userProfile.state = state;
    userProfile.city = city;
    userProfile.food = food;
    userProfile.drink = drink;
    userProfile.smoke = smoke;
    userProfile.bodyColor = bodyColor;
    userProfile.height = height;
    userProfile.weight = weight;
    userProfile.professionalStatus = professionalStatus;
    userProfile.work = work;
    userProfile.salary = salary;
    userProfile.dob = formattedDOB || '';
    userProfile.caste = caste;
    userProfile.community = community;



    // Save the updated user profile data
    await userProfile.save();

    // Optionally, you can update the corresponding user data in the User model as well
    // Example:

    // const user = await User.findByIdAndUpdate(userId, { $set: { country, state, city } }, { new: true });

    res.status(200).json({ status: 'SUCCESS', message: 'Profile updated successfully', user: userProfile });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ status: 'FAILED', message: 'Failed to update profile' });
  }
})


// fetching usersImage.js

const { truncate } = require('fs');

// upload-image working

router.post('/upload-image', authenticate, async (req, res) => {
  try {
    const { base64 } = req.body;
    const userId = req.rootUser._id; // get the authenticated id from the jwtoken if user is login

    // Find the user by ID and update their image
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found"
      });
    }

    // Update the user's image in the database
    user.image = base64;
    await user.save();

    res.json({
      status: "OK",
      message: "Image saved successfully"
    });


  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "FAILED",
      message: "Failed to save image"
    });
  }
});

// Get image for the logged-in user

router.get('/get-image', authenticate, async (req, res) => {
  try {
    const userId = req.rootUser._id; // Get the user ID from the authenticated user

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user || !user.image) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found or no image found for the user"
      });
    }

    // Send the image data in the response
    res.status(200).json({
      status: "SUCCESS",
      message: "Image read successfully",
      data: user.image
    });
  } catch (err) {
    console.log("Error while reading image:", err);
    res.status(500).json({
      status: "FAILED",
      message: "Error while reading image"
    });
  }
});



// getting multer image testing

router.get('/multerImageData', authenticate, async (req, res) => {
  try {


    const userId = req.rootUser._id; // get the authenticated id from the jwtoken if user is login

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found"
      });
    }

    const imagePath = path.join(__dirname, '..', 'uploads', user.imageData); // Assuming 'uploads' directory

    // error handling if image is not found

    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// For posting/uploading image on cloudinary 

const cloudinary = require('cloudinary').v2;


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_apikey,
  api_secret: process.env.cloudinary_secretkey
});

// Use memory storage for uploading files
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/cloudinaryUpload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert the Buffer to base64 string
    const base64Image = req.file.buffer.toString('base64');

    // Get the public ID of the previous image from the user's profile
    const user = await User.findById(req.rootUser._id);
    const previousImagePublicId = user.imageUrl ? `shaddi/${user.imageUrl.split('/').pop().split('.')[0]}` : null;
    console.log("Previous Image : ", previousImagePublicId);

    // Delete the previous image if it exists
    if (previousImagePublicId) {
      try {
        const deletionResult = await cloudinary.uploader.destroy(previousImagePublicId);
        console.log('Deletion result:', deletionResult);
      } catch (deletionError) {
        console.error('Error deleting previous image from Cloudinary:', deletionError);
        // Handle the deletion error as needed
      }
    }


    const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${base64Image}`, {
      folder: 'shaddi', // Specify the folder in Cloudinary
      use_filename: true, // Use the original filename
    });

    // Save the imageUrl to the User model
    const updatedUser = await User.findByIdAndUpdate(
      req.rootUser._id, // Assuming req.rootUser contains the authenticated user's ID
      { imageUrl: result.secure_url }, // Update imageUrl with the Cloudinary URL
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(201).json({ message: 'Image uploaded to Cloudinary and saved to database successfully', imageUrl: result.secure_url });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// verify-phone route working properly

router.post('/verify-phone_tested', async (req, res) => {

  try {
    const { phone } = req.body;

    // Validate required field
    if (!phone) {
      return res.status(400).json({ status: 'FAILED', message: 'Please provide a phone number' });
    }

    // Check if user with the same phone number already exists
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({ status: 'FAILED', message: 'Phone number already exists' });
    }

    // Create a new user object with a timestamp
    const timestamp = new Date();
    const newUser = new User({ phone, createdAt: timestamp });

    // Save the new user to the database
    const savedUser = await newUser.save();


    if (savedUser) {

      const token = await savedUser.generateAuthToken(); // here token is generating from this function which already declared in the model schema
      console.log("Retrieve Token from database: ", token);

      // storing token in the cookie

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        credentials: 'include'
      });

      // Send success response
      res.status(200).json({ status: 'SUCCESS', message: 'Phone number verified and user saved successfully', token, userId: savedUser._id });
    } else {
      // Send failure response
      res.status(500).json({ status: 'FAILED', message: 'Error saving user data' });
    }


  } catch (error) {
    console.error('Error during phone number verification:', error);
    res.status(500).json({ status: 'FAILED', message: 'Internal server error' });
  }

})

// forgot password working

router.post('/forgot-password', (req, res)=> {

  const {email} = req.body;

  User.findOne({email})
  .then(user => {
    if(!user)
      {
        return res.send({Status: "User Email is not present"})
      }
    const token = jwt.sign({id:user._id}, "JWT_SECRET", {expiresIn: "1d"}) // payload , secret_key, optional

    // using nodemailer to send email

    var transporter = nodemailer.createTransport({ 
      service: 'gmail',
      auth: {
        user: process.env.Auth_mail,
        pass: process.env.Email_pass
      }
    });
    
    var mailOptions = {
      from: process.env.Auth_mail,
      to: email,
      subject: 'Reset your password',
      text: `https://shaddi.onrender.com/reset-password/${user._id}/${token}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        return res.send({Status:"Success"})
      }
    });

  })
  .catch((err) => {
    console.log('Error while using forgetting password...', err)
  })
} )

// reset password working

router.post('/reset-password/:id/:token', (req, res) => {

  const {password} = req.body;
  const {id, token} = req.params; // getting it from url

  jwt.verify(token, "JWT_SECRET", (err, decoded) => {

    if(err)
      {
        return res.json({Status:'Error with token'})
      }
    else{
      bcrypt.hash(password, 10)
      .then(hash => {
        User.findByIdAndUpdate({_id:id}, {password:hash})
        .then(u => {
          res.send({Status:"Success"})

        })
        .catch(err => {
          res.send({Status:'Error'})
        })
      })
      .catch(err => {
        console.log("Internal Server Error while resetting the password")
      })
    }

  } )

  
})

// contactus sending message working

router.post('/contactus', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ status: 'FAILURE', message: 'Email and message are required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: 'FAILURE', message: 'User not found.' });
    }

    await user.addMessage(message);

    res.status(200).json({ status: 'SUCCESS', message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ status: 'FAILURE', message: 'Server error. Please try again later.' });
  }
});

// contactus getting messages working

router.get('/user/messages', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ status: 'FAILURE', message: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: 'FAILURE', message: 'User not found.' });
    }

    res.status(200).json({ status: 'SUCCESS', messages: user.messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ status: 'FAILURE', message: 'Server error. Please try again later.' });
  }
});



module.exports = router
