const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const User = require('../model/User')



// signup

router.post("/signup", (req,res) => {

    let {name, email, dob, password } = req.body;

    name = name.trim();
    email= email.trim();
    dob = dob.trim();
    password= password.trim();

    if(name ==="" || email==="" || dob==="" || password ==="")
    {
        res.json({
            status:"FAILED",
            message:"Input Fields must be filled"
        })
    }

    // else if(!/^[a-zA-Z]*$/.test(name))
    // {
    //     res.json({
    //         status:"FAILED",
    //         message:"Invalid Name Entered"
    //     })
    // }

    
    else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
    {
        res.json({
            status:"FAILED",
            message:"Invalid Email Entered"
        })
    }

    else if(!new Date(dob).getTime() )
    {
        res.json({
            status:"FAILED",
            message:"Invalid Date of Birth Entered"
        })
    }

    else if(password.length < 8 )
    {
        res.json({
            status:"FAILED",
            message:"Password length is too short"
        })
    }
    else{

        // checking if email already exits or not

        User.find({email}).then( result => {

            if(result.length)
            {
                res.json({
                    status:"FAILED",
                    message:"Email Already Exists..."
                })
            }
            else{

                //password handler
                const saltRound = 10
                bcrypt.hash(password, saltRound). then(hashedPassword => {

                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dob
                    })

                    newUser.save() .then(result => {

                        res.json({
                            status:"SUCCESS",
                            message:"Successfully Created a New User",
                            data: result
                        })

                    }). catch(err => {
                        res.json({
                            status:"FAILED",
                            message:"An Error Occured while Creating a new User : ",err
                        })
                    })

                }) .catch(err => {
                    console.log("An Error occured while Hashing the password : ", err);

                    res.json({
                        status:"FAILED",
                        message:"An Error occured while Hashing the password"
                    })
                })

            }

        }) .catch(err => {
            console.log("Email Checking :", err);
            res.json({
                status:"FAILED",
                message:"An Error occured while checking the existing Email"
            })
        })

    }

    

    
})


// signin Route

router.post("/signin", (req, res) => {

    let { email, password } = req.body;

    email= email.trim();   
    password= password.trim();

    if(email ==="" || password ==="")
    {
        res.json({
            status:"FAILED",
            message:"Empty Credentials provided..."
        })
    }
    else{

        User.find({email}). then( data => {
            //user Exists

            if(data)
            {

                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword). then(result => {

                    if(result)
                    {
                        // password matched

                        res.json({
                            status:"SUCCESS",
                            message:"Login Successful",
                            data: result
                        })
                    }
                    else
                    {
                        // password wrong

                        res.json({
                            status:"FAILED",
                            message:"Invalid Password Entered"
                        })

                    }

                  

                }) .catch(err => {

                    res.json({
                        status:"FAILED",
                        message:"An Error Occured while comparing  the password"
                    })
                   
                })

            }
            else{

                res.json({
                    status:"FAILED",
                    message:"Invalid Credential Entered"
                })
                
            }


        }) .catch(err => {
            res.json({
                status:"FAILED",
                message:"Error While Checking Credentials with Existing User...",
                data: err
            })
        })
    }


})

module.exports = router