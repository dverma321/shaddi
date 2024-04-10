import React, { createContext, useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Heart from './components/Heart';

import { initializeApp } from 'firebase/app'; // Import initializeApp from Firebase App
import { getAuth } from 'firebase/auth'; // Import getAuth from Firebase Auth

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import Logout from './pages/Logout';
import { Registration } from './pages/Registration';
// import { Blog } from './pages/Blog'; 
import About from './pages/About';
import { ContactUs } from './pages/Contact';
import Myprofile from './pages/Myprofile';
import GlobalChats from './pages/chatting';
import Match from './pages/Match';
import ImageUpload from './pages/ImageUpload';

import { setUpRecaptcha } from './context/UserContext'; 


import { initialState, reducer } from './reducer/useReducer';
import PhoneSignUp from './pages/PhoneSignUp';
import PhoneLogin from './pages/PhoneLogin';
import TestingPhoneSignUp from './pages/TestingPhoneSignUp';

export const userContext = createContext();

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [authInitialized, setAuthInitialized] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtoken'); // Check if token exists in local storage
    if (token) {
      // If token exists, dispatch an action to set the user state
      dispatch({ type: 'USER', payload: true });
    }

    
    // Initialize Firebase Auth and set up reCAPTCHA verifier
    
    const firebaseConfig = {
      apiKey: "AIzaSyDTyifGl9Oj8WTXnpsTunSihMJhVGkRXKw",
      authDomain: "sendotp-d3199.firebaseapp.com",
      projectId: "sendotp-d3199",
      storageBucket: "sendotp-d3199.appspot.com",
      messagingSenderId: "756334147974",
      appId: "1:756334147974:web:f298334f4e7e222114d407",
      measurementId: "G-TNX19XJ4BT"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app); // Pass the initialized app to getAuth

    try {
      // Set up reCAPTCHA verifier (optional: conditionally initialize if needed)
      const verifier = setUpRecaptcha(auth);
      setRecaptchaVerifier(verifier);
    } catch (error) {
      console.error('Error setting up reCAPTCHA verifier:', error);
    }

    setAuthInitialized(true); // Mark auth initialization as complete
  }, []);  

  if (!authInitialized) {
    // Show a loading indicator or fallback UI while auth is initializing
    return <div>Loading...</div>;
  }

  


  return (
    <userContext.Provider value={{ state, dispatch, recaptchaVerifier }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/myprofile" element={<Myprofile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/heart" element={<Heart />} />
          <Route path="/yourmatching" element={<Match />} />
          <Route path="/yourimage" element={<ImageUpload />} />
          <Route path="/chatting" element={<GlobalChats />} />
          <Route path="/phonesignup" element={<PhoneSignUp />} />
          <Route path="/phonelogin" element={<PhoneLogin />} />
          <Route path="/testingphone" element={<TestingPhoneSignUp />} />
          
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
};

export default App;
