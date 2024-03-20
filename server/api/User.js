const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path');  // Add this line to import the 'path' module
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const moment = require('moment'); // for Date Format
const cors = require('cors');

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

// signup

router.post("/signup1", (req, res) => {

    let { name, email, password, confirmPassword, gender, phone } = req.body.user;
    
    name = name.trim();
    email = email.trim();
    gender = gender.trim();
    phone = phone.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    // dob = dob.trim();
    // country = country.trim();
    // state = state.trim();
    // city = city.trim();
    // pincode = pincode.trim();
    // faceColor = faceColor.trim();

    // work = work.trim();
    // alternateMobileNumber = alternateMobileNumber.trim();

    if (name === "" || email === "" || password === "" || confirmPassword === "" || gender === "" || phone === "") {
        return res.json({
            status: "FAILED",
            message: "Input Fields must be filled"
        });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.json({
            status: "FAILED",
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
            status: "FAILED",
            message: "Password length is too short"
        });
    }


    if (password !== confirmPassword) {
        return res.json({
            status: "FAILED",
            message: "Passwords do not match"
        });
    }


    // checking if email already exists or not
    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.json({
                    status: "FAILED",
                    message: "Email Already Exists..."
                });
            }

            // password handler
            const saltRounds = 10;

            bcrypt.hash(password, saltRounds)
                .then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        confirmPassword: hashedPassword,
                        gender,
                        phone,
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


// Testing purpose signup

router.post('/signup', async (req, res, next) => {
    try {
      // Extract user data from request body
      const { name, email, phone, gender, password, confirmPassword } = req.body.user;
  
      // Validate required fields
      if (!name || !email || !phone || !gender || !password || !confirmPassword) {
        return res.status(400).json({ status: 'FAILED', message: 'Please fill all the fields' });
      }
  
      // Check if user with the same email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ status: 'FAILED', message: 'Email already exists' });
      }
  
      // Create a new user object
      const newUser = new User({ name, email, phone, gender, password, confirmPassword});
  
      // Save the new user to the database
      await newUser.save();
  
      // Send success response
      res.status(200).json({ status: 'SUCCESS', message: 'User registered successfully' });
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


// Signin route with JWT
router.post("/signin1", async (req, res) => {
    let { email, password } = req.body;
  
    email = email.trim();
    password = password.trim();
  
    if (email === "" || password === "") {
      res.json({
        status: "FAILED",
        message: "Empty Credentials provided..."
      });
    } else {
      try {
        const user = await User.findOne({ email });
  
        if (!user) {
          return res.json({
            status: "FAILED",
            message: "Invalid Credential Entered"
          });
        }
  
        if (!user.verified) {
          return res.json({
            status: "FAILED",
            message: "User hasn't been verified yet, check your inbox"
          });
        }
  
        const match = await bcrypt.compare(password, user.password);
  
        if (match) {
          // Create JWT token
          const token = jwt.sign({ 
            userId: user._id,
            name: user.name, // Include user name in token payload
            phone: user.phone, // Include user phone number in token payload 
            gender: user.gender,
            
          }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expires in 1 hour
          });
  
          res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 3600000), // Cookie expires in 1 hour
            httpOnly: true // Cookie is accessible only by the server
          });
  
          res.json({
            status: "SUCCESS",
            message: "Login Successful",
            token,
            userId: user._id
          });
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid Password Entered"
          });
        }
      } catch (error) {
        console.error('Error during Login:', error);
        res.json({
          status: "FAILED",
          message: "An Error Occurred during Login"
        });
      }
    }
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
        message: "Invalid credentials."
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        status: "FAILED",
        message: "Invalid credentials."
      });
    }

    const token = await user.generateAuthToken();
    console.log("Retrieve Token from database: ", token);

    // storing token in the cookie

    res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true
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
        path: '/'
    })
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

router.get('/users', cors(), async (req, res) => {
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


// Logout route

router.get('/logout', cors(), (req, res) => {
    // Clear the session or token on the server side
    // Example for clearing a session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.json({
                status: 'FAILED',
                message: 'Error during logout'
            });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.json({
            status: 'SUCCESS',
            message: 'Logout successful'
        });
    });
});




module.exports = router
