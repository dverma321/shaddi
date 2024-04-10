import React, { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { userContext } from '../App';


import '../pages/PhoneSignUp.css';

const TestingPhoneSignUp = () => {
  const { dispatch } = useContext(userContext);
  const [Number, setNumber] = useState('');
 
  const [error, setError] = useState('');

  const navigation = useNavigate();

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
   
    try {
      

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
      console.log("Error from React side Inter server error :", error)
    }

  }

  return (

    <div className="container">
      <div className="form-container">
        <h3>Signup using Mobile Number</h3>
        <Form onSubmit={verifyOtp} >
          <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
            <PhoneInput
              defaultCountry='IN'
              value={Number}
              placeholder="Enter Phone Number"
              onChange={setNumber}
            />

            {/* Display error message */}
            {error && <div className="text-danger">{error}</div>}

          </Form.Group>
          <div className='button-container mt-3'>
            <Link to="/" className='button-link'>
              <Button variant='secondary'>Cancel</Button> &nbsp;
            </Link>
            <Button variant='primary' type='submit'>Submit</Button>
          </div>
        </Form>

       
      </div>
    </div>

  );
};

export default TestingPhoneSignUp;
