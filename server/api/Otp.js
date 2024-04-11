const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');


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

const router = express.Router();
const otpController = require('../controller/otp.controller.js')

router.post('/verify-phone', otpController.userLogin);
router.post('/verify-number', otpController.loginByUsingMobileNumber);


module.exports = router;
