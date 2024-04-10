import React, { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { userContext } from '../App';
import { setUpRecaptcha } from '../context/UserContext'; // Import setUpRecaptcha function

import '../pages/PhoneSignUp.css';

const PhoneSignUp = () => {
  const { dispatch } = useContext(userContext);
  const [Number, setNumber] = useState('');
  const [otp, setOTP] = useState("");
  const [confirmobject, setConfirmobject] = useState("");
  const [Flag, setFlag] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigate();

  const getOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (Number === '' || Number === undefined) {
      return setError('Please enter a valid phone number');
    }

    try {
      const confirmationResult = await setUpRecaptcha(Number);
      console.log('ReCAPTCHA and phone number verification initiated:', confirmationResult);

      setConfirmobject(confirmationResult);
      setFlag(true);

    } catch (error) {
      console.error('Error setting up reCAPTCHA or signing in:', error);
      setError('Error setting up reCAPTCHA or signing in. Please try again.');
    }

    console.log('Phone number:', Number);
  }

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    console.log(otp);
    if (otp === "" || otp === null) return setError("Please Enter OTP ...");

    try {
      
      await confirmobject.confirm(otp);

      // If OTP verification is successful, make an API request to store the phone number

      const URI = 'http://localhost:3000/otp/verify-number'; 

      const response = await fetch(`${URI}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: Number }), // Send the verified phone number to the backend
        credentials: 'include', // Include this line  
      });

      const responseData = await response.json();
      console.log("Response Data : ", responseData);

      if (responseData.status==="SUCCESS") {

        const { token, userId } = responseData;    
        
         // Store the token in localStorage
         localStorage.setItem('jwtoken', token);

         // Dispatch user action to update context
         dispatch({ type: "USER", payload: true });
 

        window.alert('Mobile Number Registed Successfully...')

        navigation("/myprofile"); // Navigate to another page after successful verification and storing

      } 
      else{
        window.alert('Mobile Number already present');

      }

    } catch (error) {
      setError(error.message);
      console.log("Error while Verifying OTP or storing phone number:", error)
    }

  }

  return (

    <div className="container">
      <div className="form-container">
        <h3>Signup using Mobile Number</h3>
        <Form onSubmit={getOtp} style={{ display: Flag ? 'none' : 'block' }}>
          <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
            <PhoneInput
              defaultCountry='IN'
              value={Number}
              placeholder="Enter Phone Number"
              onChange={setNumber}
            />

            {/* Display error message */}
            {error && <div className="text-danger">{error}</div>}

            {/*  recaptcha container  */}
            <div id="recaptcha-container" className='mt-2' />
          </Form.Group>
          <div className='button-container mt-3'>
            <Link to="/" className='button-link'>
              <Button variant='secondary'>Cancel</Button> &nbsp;
            </Link>
            <Button variant='primary' type='submit'>Send OTP</Button>
          </div>
        </Form>

        <div className="form-outline text-center mt-3">
          <NavLink to="/register" className="navlink_login"><i className="zmdi zmdi-tag"></i> Registration Using email Method</NavLink>
        </div>



        <Form onSubmit={verifyOtp} style={{ display: Flag ? 'block' : 'none' }} className='mt-5' >
          <Form.Group className="mb-3" controlId="formBasicOtp">

            <Form.Control
              type="text" placeholder="Enter OTP here" onChange={(e) => setOTP(e.target.value)} >
            </Form.Control>
          </Form.Group>

          {/* Display error message */}
          {error && <div className="text-danger">{error}</div>}

          <div className='button-container mt-3'>
            <Link to="/" className='button-link'>
              <Button variant='secondary'>Cancel</Button> &nbsp;
            </Link>
            <Button variant='primary' type='submit'>Verify OTP</Button>
          </div>
        </Form>
      </div>
    </div>

  );
};

export default PhoneSignUp;
