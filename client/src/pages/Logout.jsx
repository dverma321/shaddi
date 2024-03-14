import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { userContext } from '../App';

const Logout = () => {
  const navigation = useNavigate();

  const {state, dispatch} = useContext(userContext);
  

  // Clear the token from cookies when the component mounts
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  // For localStorage: localStorage.removeItem('token');

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Make a request to the logout endpoint on your server

        const URI = "http://localhost:3000/user/logout";

        const response = await fetch(`${URI}`, {
          method: 'GET',
          credentials: 'include', // Include credentials (cookies) in the request
        });

        const data = await response.json();

        if (response.status === 200 && data.status === 'SUCCESS') {
          // Clear any user-related data or state on the frontend
          // Redirect to the login page
          dispatch({type:"USER", payload:false});
          navigation('/login');
        } else {
          // Handle logout failure
          console.error('Logout failed:', data.message);
        }
      } catch (error) {
        console.error('Error during logout:', error);
        // Handle other errors as needed
      }
    };

    // Call the logoutUser function when the component mounts
    logoutUser();
  }, [navigation]);

  return (
    <div>Welcome to Logout Page</div>
  );
};

export default Logout;
