import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from '../images/signup.webp';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';


export const Registration = () => {

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: ""
    })

    const handleRadioChange = (event) => {
        setUser({
            ...user,
            gender: event.target.value,
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        // console.log(`Field Name: ${name}, Field Value: ${value}`);
        setUser({
            ...user,
            [name]: value,
        });
    };




    async function handleSubmit(event) {

        event.preventDefault();

        const { name, email, phone, gender, password, confirmPassword } = user;

        if (!name || !email || !phone || !gender || !password || !confirmPassword) {
            return window.alert("Please fill all the fields...")
        }

        if (password !== confirmPassword) {
            return window.alert("Password are not the same...")
        }

        try {
            // const URI = 'http://localhost:3000/user/signup'; 

            const URI = 'https://shaddi.onrender.com/user/signup'; 

            const response = await fetch(`${URI}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(user), // if not working then remove below body part
                body: JSON.stringify({
                    user
                    // base64: image
                }),
            });


            const data = await response.json();
            console.log("Data : ", data)

            if (data.status === "FAILED" || !data) {
                window.alert('Invalid Registration  or Email/Phone number already exits');
                console.log("Invalid Registration");
            }
            else {
                window.alert(' Registration Successful Please Login');
                console.log(" Registration Successful please Login");

                // Reset the form after successful registration
                setUser({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    confirmPassword: "",
                    gender: ""
                });
            }

        }

        catch (error) {
            console.error('Error during registration:', error);
        }


    }

    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center mt-5">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body p-5">
                                <h2 className="text-uppercase text-center mb-5"> Create Account For Free</h2>

                                <div className='form-outline text-center mb-4'>
                                    <img src={Signup} alt='image' className='img-fluid' />
                                </div>

                                <form method='POST' className='register-form' id='register-form'>

                                    <div className="row">
                                        {/* Section 1: Personal Data */}
                                        <div className="col-md-12">
                                            <div className="form-section">
                                                <h3 className="text-center mb-4">Personal Data</h3>
                                                {/* ... Your personal data fields */}

                                                <div className="form-outline mb-12">
                                                    <label className="form-label" htmlFor='name'><i className="zmdi zmdi-account material-icons-name"></i> Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="formyourname"
                                                        className="form-control form-control-lg"
                                                        placeholder='Enter your name'
                                                        autoComplete='off'
                                                        value={user.name}
                                                        onChange={handleChange}

                                                        required
                                                    />
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <label className="form-label" htmlFor="labelemail"><i className="zmdi zmdi-email"></i> Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="formyouremail"
                                                        className="form-control form-control-lg"
                                                        placeholder='Enter your email'
                                                        autoComplete='off'
                                                        value={user.email}
                                                        onChange={handleChange}

                                                        required
                                                    />
                                                </div>

                                                <div class="form-outline mb-4">
                                                    <label class="form-label" for="labelphone"><i class="zmdi zmdi-phone"></i> Phone</label>
                                                    <input type="text" name="phone" id="formphone" class="form-control form-control-lg" placeholder='Enter your number'
                                                        value={user.phone}
                                                        onChange={handleChange}

                                                        required />
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <label className="form-label"><i className="zmdi zmdi-account"></i> Gender :</label>
                                                    <input className="m-3" type="radio" id="male" name="gender" value="male"
                                                        checked={user.gender === "male"}
                                                        onChange={handleRadioChange}
                                                        required />
                                                    <label htmlFor="male">Male</label>

                                                    <input className="m-3" type="radio" id="female" name="gender" value="female"

                                                        checked={user.gender === "female"}
                                                        onChange={handleRadioChange}
                                                        required />
                                                    <label htmlFor="female">Female</label>
                                                </div>

                                                <div class="form-outline mb-4">
                                                    <label class="form-label" for="labelyourpassword"><i class="zmdi zmdi-lock"></i> Password</label>
                                                    <input type="password" name="password" id="formyourpassword" class="form-control form-control-lg" placeholder='Enter password' autoComplete='off'
                                                        value={user.password}
                                                        onChange={handleChange}

                                                        required />
                                                </div>

                                                <div class="form-outline mb-4">
                                                    <label class="form-label" for="labelconfirmpassword"><i class="zmdi zmdi-lock"></i> Repeat your password</label>
                                                    <input type="password" name="confirmPassword" id="formconfirmpassword" class="form-control form-control-lg" placeholder='Repeat password' autoComplete='off'
                                                        value={user.confirmPassword}
                                                        onChange={handleChange}
                                                        required />
                                                </div>

                                                {/* <div class="form-outline mb-4">
                                                    <label class="form-label" for="photoupload"><i class="zmdi zmdi-lock"></i> Upload Photo</label>
                                                    <input name="image" accept='image/*'  type='file' onChange={convertToBase64} class="form-control form-control-lg"
                                                       
                                                    required />
                                                </div> */}



                                            </div>
                                        </div>


                                    </div>

                                    <div className="form-outline form-group form-button text-center">
                                        <input type='submit' name='registration' id="registration" className='btn btn-primary btn-lg' value="Register" onClick={handleSubmit} />
                                    </div>

                                </form>

                                <div className="form-outline text-center">
                                    <NavLink to="/login" className="navlink_login"><i className="zmdi zmdi-tag"></i> I am Already Registered User</NavLink>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
