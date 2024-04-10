import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { userContext } from '../App';
import '../pages/Match.css';
import Chatting from '../pages/chatting'; // Import the Chatting component

const Match = () => {
  const { state } = useContext(userContext);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [AgeMessage, setAgeMessage] = useState('');


  // For calculating Age For the Database user's Age

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Age calculation ended

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

      const userAge = calculateAge(userData.dob);
      if (userAge < 18) {
        setAgeMessage('You must be at least 18 years old to use this service. Dont Worry you can come here once your age is 18+. keep visiting this website.'); // Set error message if user is below 18
        return;
      }

      if (userData.gender) {
        const oppositeGender = userData.gender === 'male' ? 'female' : 'male';

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
          const stateMatch = user.state && userData.state && user.state.trim().toLowerCase() === userData.state.trim().toLowerCase();
          // const cityMatch = user.city && userData.city && user.city.trim().toLowerCase() === userData.city.trim().toLowerCase();
          // const casteMatch = user.caste && userData.caste && user.caste.trim().toLowerCase() === userData.caste.trim().toLowerCase();
          // const professionalMatch = user.professionalStatus && userData.professionalStatus && user.professionalStatus.trim().toLowerCase() === userData.professionalStatus.trim().toLowerCase();
          const oppositeGenderMatch = user.gender && userData.gender && user.gender !== userData.gender;

          // Calculate age from date of birth
          const userAge = calculateAge(user.dob);

          // Minimum age check (e.g., 18 years)
          const minimumAge = 18;
          const isAboveMinimumAge = userAge >= minimumAge;


          // Add more criteria as needed

          // Apply strict filters on country, state, and caste but not on city, professional status, and others
          return oppositeGenderMatch && countryMatch && stateMatch  && isAboveMinimumAge;

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

  console.log('Filtered users:', filteredUsers); // Log filteredUsers data

  if (!state) {
    return <Navigate to="/login" replace />;
  }

  if (errorMessage) {
    return (
      <div>
        <p className='error-message'>{errorMessage}</p>
      </div>
    );
  }

  if (AgeMessage) {
    return (
      <div>
        <p className='error-message'>{AgeMessage}</p>
      </div>
    );
  }

   // Handle edit button click
   const handleEdit = (user) => {
    window.alert('Site is under construction. keep prompting this website to find your love soon...');
  };

  return (
    <div>

      <h2>All Users From MongoDB Database:</h2>
      {filteredUsers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Image</th>
              <th>DOB</th>
              <th>AGE</th>
              <th>Caste</th>
              <th>Community</th>
              <th>Country</th>
              <th>State</th>
              <th>City</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.gender}</td>
                <td><img src={user.imageUrl} alt={user.name} style={{ height: "150px", width: "150px", border:'2px solid #000', padding:'1%' }} /></td>
                <td>{user.dob}</td>
                <td>{calculateAge(user.dob)}</td>
                <td>{user.caste}</td>
                <td>{user.community}</td>
                <td>{user.country}</td>
                <td>{user.state}</td>
                <td>{user.city}</td>
                <td>
                  <button className='accept' onClick={() => handleEdit(user)}>Send Request</button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className='error-message'>No matching records found. <br /> Here Data is fetching from the Registered user on this website according to your country, state/provision, city and caste <br /> If No Record is found that means no user is fullfied your match... <br /> Keep visiting this website continuously you will get matched partner automatically once match user is found</p>
      )}

   

    </div>
  );
};

export default Match;
