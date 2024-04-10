import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import '../pages/Login.css';
import loginImage from '../images/login.jpg';
import { setUpRecaptcha } from '../context/UserContext'; // Import setUpRecaptcha function

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmobject, setConfirmobject] = useState("");

  const [error, setError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigation = useNavigate();

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (phoneNumber === '' || phoneNumber === undefined) {
      return setError('Please enter a valid phone number');
    }

    try {
      const confirmationResult = await setUpRecaptcha(phoneNumber);
      console.log('ReCAPTCHA and phone number verification initiated:', confirmationResult);
      
      setConfirmobject(confirmationResult);
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error setting up reCAPTCHA or signing in:', error);
      setError('Error setting up reCAPTCHA or signing in. Please try again.');
    }

    console.log('Phone number:', phoneNumber);
  };


  // verification code after sent otp

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
        body: JSON.stringify({ phone: phoneNumber }), // Send the verified phone number to the backend
      });

      const responseData = await response.json();
      console.log("Response Data : ", responseData);

      if (responseData.status==="SUCCESS") {

        const { token, userId } = responseData;

        // Store the token in localStorage
        localStorage.setItem('jwtoken', token);

        // Dispatch user action to update context
        dispatch({ type: "USER", payload: true });

        window.alert('User Login Successfully...')

        navigation("/myprofile"); // Navigate to another page after successful verification and storing

      } 
      else{
        window.alert('Invalid OTP...');

      }

    } catch (error) {
      setError(error.message);
      console.log("Error while login using mobile number:", error)
    }

  }

 

  return (
    <div className="container">
      <div className="form-container">
        <h3>Login using Mobile Number</h3>
        <Form onSubmit={sendOtp} style={{ display: isOtpSent ? 'none' : 'block' }}>
          <Form.Group controlId="formBasicPhoneNumber">
            <PhoneInput
              defaultCountry="IN"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter Phone Number"
            />

            
            {/* Display error message */}
            {error && <div className="text-danger">{error}</div>}

            {/*  recaptcha container  */}
            <div id="recaptcha-container" className='mt-2' />

          </Form.Group>

          <div className='button-container mt-3'>
            <Link to="/phonelogin" className='button-link'>
              <Button variant='secondary'>Cancel</Button> &nbsp;
            </Link>
            <Button variant='primary' type='submit'>Send OTP</Button>
          </div>

        </Form>       
        

          <Form onSubmit={verifyOtp} style={{ display: isOtpSent ? 'block' : 'none' }} className='mt-5' >
          <Form.Group className="mb-3" controlId="formBasicOtp">

            <Form.Control
              type="text" placeholder="Enter OTP here" onChange={(e) => setOtp(e.target.value)} >
            </Form.Control>
          </Form.Group>

          {/* Display error message */}
          {error && <div className="text-danger">{error}</div>}

          <div className='button-container mt-3'>
            <Link to="/phonelogin" className='button-link'>
              <Button variant='secondary'>Cancel</Button> &nbsp;
            </Link>
            <Button variant='primary' type='submit'>Verify OTP</Button>
          </div>
        </Form>
        
       
      </div>
    </div>
  );
};

export default PhoneLogin;
