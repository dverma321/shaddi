import React, { useContext, useState, useEffect } from 'react';
import '../pages/chatting.css'; // Import your CSS file for styling

import { Navigate } from 'react-router-dom';
import { userContext } from '../App';
import '../pages/Match.css';

const Chatting = ( ) => { 


  const { state } = useContext(userContext);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const callGetUserData = async () => {
    try {
      const token = localStorage.getItem('jwtoken');
      const backendURL = 'http://localhost:3000'; // backend server url  

      // const backendURL = 'https://shaddi.onrender.com'; // backend server url  

      const userDataRes = await fetch(`${backendURL}/user/getData`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': 'https://findyourperfectmatch.netlify.app', // Specify allowed origin

        },
        credentials: 'include',
      });
      const userData = await userDataRes.json();

      if (!userData.imageUrl) {
        setErrorMessage('Please upload an image first and Other Profile Data to check if any user is matched with your profile or not.'); // Set error message if imageUrl is not present
        return;
      }     

      if (userData.gender) {

        const usersRes = await fetch(`${backendURL}/user/users`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });
        const usersData = await usersRes.json();

        const filteredData = usersData.filter(user => {

          const countryMatch = user.country && userData.country && user.country.trim().toLowerCase() === userData.country.trim().toLowerCase();         
          const sameGenderMatch = user.gender && userData.gender && user.gender === userData.gender;

          // Add more criteria as needed

          return  sameGenderMatch && countryMatch ;

        });

        setFilteredUsers(filteredData);
      } else {
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (state) {
      callGetUserData();
    }
  }, [state]);



  return (
    <div className="global-chats-container">
      <div className="users-list">
        <h1 style={{color:"red", padding: '1%', textAlign:'center', border:'2px solid black', textTransform:'uppercase'}}>Database Users</h1>
        {/* User List */}
        <ul>
          {filteredUsers.map((user, index) => (
            <li key={index}>{user.name.toUpperCase()}</li>
          ))}
        </ul>
      </div>
      <div className="chat-panel">
        {/* Chat Panel */}
        <h1>Chat Panel <br/> Under Construction please stay conntected and always keep login...</h1>
        {/* Chat messages can be displayed here */}
      </div>
    </div>
  );
};

export default Chatting;
