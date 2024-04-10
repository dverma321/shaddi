const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


//getting User 

const User = require('../model/User')

const router = express.Router();
const otpController = require('../controller/otp.controller.js')

router.post('/verify-phone', otpController.userLogin);
router.post('/verify-number', otpController.loginByUsingMobileNumber);


module.exports = router;