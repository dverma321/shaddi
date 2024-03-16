const jwt = require('jsonwebtoken');
const User = require('../model/User');
require('dotenv').config();


const Authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    console.log('Request Cookies:', req.cookies);
    console.log('JWToken : ', token)

    if (!token) {
      throw new Error('Unauthorized: No Token Provided');
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

    if (!rootUser) {
      throw new Error('Unauthorized: User Not Found');
    }
 
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    console.error('Catch Authentication Error:', err);
    res.status(401).json({ error: err.message }); // Send one response with status 401 and error message
  }
};

module.exports = Authenticate;
