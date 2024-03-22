import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { userContext } from '../App';

const Logout = () => {
  const navigation = useNavigate();

  const { state, dispatch } = useContext(userContext);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Make a request to the logout endpoint on your server
        const URI = 'http://localhost:3000'; 
        
        // const URI = 'https://shaddi.onrender.com'; 
        
        const response = await fetch(`${URI}/user/logout`, {
          method: 'GET',
          credentials: 'include', // Include credentials (cookies) in the request
        });

        const data = await response.json();

        if (response.status === 200 && data.status === 'SUCCESS') {
          // Clear the token from cookies when the logout is successful
          document.cookie = 'jwtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          localStorage.removeItem('jwtoken');
          console.log('Logout successful');

          // For localStorage: localStorage.removeItem('token');

          // Clear any user-related data or state on the frontend
          dispatch({ type: 'USER', payload: false });

          // Redirect to the login page
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
  }, [dispatch, navigation]);

  return <div>Welcome to Logout Page</div>;
};

export default Logout;
