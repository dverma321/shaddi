const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path');  // Add this line to import the 'path' module

const router = express.Router()

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

router.post("/signup", (req, res) => {

    let { name, email, dob, password } = req.body;

    name = name.trim();
    email = email.trim();
    dob = dob.trim();
    password = password.trim();

    if (name === "" || email === "" || dob === "" || password === "") {
        res.json({
            status: "FAILED",
            message: "Input Fields must be filled"
        })
    }


    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid Email Entered"
        })
    }

    else if (!new Date(dob).getTime()) {
        res.json({
            status: "FAILED",
            message: "Invalid Date of Birth Entered"
        })
    }

    else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password length is too short"
        })
    }
    else {

        // checking if email already exits or not

        User.find({ email })
            .then(result => {

                if (result.length) {
                    res.json({
                        status: "FAILED",
                        message: "Email Already Exists..."
                    })
                }
                else {

                    //password handler
                    const saltRound = 10
                    bcrypt.hash(password, saltRound)
                        .then(hashedPassword => {

                            const newUser = new User({
                                name,
                                email,
                                password: hashedPassword,
                                dob,
                                verified: false
                            })

                            newUser.save().then(result => {
                               
                                // send verification Email

                                sendVerificationEmail(result, res);

                            }).catch(err => {
                                console.error("Error during user creation:", err);
                                res.json({
                                    status: "FAILED",
                                    message: "An Error Occured while Creating a new User : ", err
                                })
                            })

                        }).catch(err => {
                            console.log("An Error occured while Hashing the password : ", err);

                            res.json({
                                status: "FAILED",
                                message: "An Error occured while Hashing the password"
                            })
                        })

                }

            }).catch(err => {
                console.log("Email Checking :", err);
                res.json({
                    status: "FAILED",
                    message: "An Error occured while checking the existing Email"
                })
            })

    }
})

// send verfication Email

const sendVerificationEmail = ({ _id, email }, res) => {


    // url to be used in the email current local and after hosting  use hosting website url
    const currentUrl = "http://localhost:3000/"; // choose render url while online
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
                            console.log("Error While Comparing unique String value ",err);
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


// signin Route

router.post("/signin", (req, res) => {

    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (email === "" || password === "") {
        res.json({
            status: "FAILED",
            message: "Empty Credentials provided..."
        })
    }
    else {

        User.find({ email }).then(data => {
            //user Exists

            if (data.length) {

                // check if user is verified 

                if (!data[0].verified) {
                    res.json({
                        status: "FAILED",
                        message: "User hasn't been verified yet, check your inbox",

                    })

                }
                else {

                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword).then(result => {

                        if (result) {
                            // password matched

                            res.json({
                                status: "SUCCESS",
                                message: "Login Successful",
                                data: result
                            })
                        }
                        else {
                            // password wrong

                            res.json({
                                status: "FAILED",
                                message: "Invalid Password Entered"
                            })

                        }



                    }).catch(err => {

                        res.json({
                            status: "FAILED",
                            message: "An Error Occured while comparing  the password"
                        })

                    })

                }
            }
            else {

                res.json({
                    status: "FAILED",
                    message: "Invalid Credential Entered"
                })

            }


        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "Error While Checking Credentials with Existing User...",
                data: err
            })
        })
    }


})

module.exports = router