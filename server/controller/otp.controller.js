const User = require('../model/User');
const Authenticate = require('../middleware/authentication'); // Import your Authenticate middleware


class OtpController {
  static userLogin = async (req, res) => {

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

      const token = await existingUser.generateAuthToken(); // here token is generating from this function which already declared in the model schema
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
        res.status(200).json({ status: 'SUCCESS', message: 'Phone number verified and user saved successfully', token, userId: existingUser._id });
      } else {
        // Send failure response
        res.status(500).json({ status: 'FAILED', message: 'Error saving user data' });
      }


    } catch (error) {
      console.error('Error during phone number verification:', error);
      res.status(500).json({ status: 'FAILED', message: 'Internal server error' });
    }


  };

  static loginByUsingMobileNumber = async (req, res) => {

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
  }
}

 

module.exports = OtpController;
