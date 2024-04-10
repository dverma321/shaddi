import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import heartTreeImage from '../images/heart_tree.png';
import candlelight from '../images/gif/candlelight.gif';

import meeting from '../images/gif/meeting.gif';
import { userContext } from '../App'; // Import the userContext
import '../pages/Home.css';
import '../components/Heart';
import Heart from '../components/Heart';

export const Home = () => {
  const { state } = useContext(userContext); // Get the login state from context
  const [user, setUser] = useState(null);

  const callGetData = async () => {
    try {
      const token = localStorage.getItem('jwtoken');
      
      const backendURL = 'http://localhost:3000'; 
      // const backendURL = 'https://shaddi.onrender.com'; 

      const res = await fetch(`${backendURL}/user/getData`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': 'https://findyourperfectmatch.netlify.app', // Specify allowed origin
        },
        credentials: 'include',
      });

      const data = await res.json();
      setUser(data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    callGetData();
  }, []);

  return (
    <div className="position-relative">
      <img src={heartTreeImage} alt="Heart Tree" className="img-fluid" />
      <div className="overlay-text  top-50 start-50 translate-middle text-center">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 ">
              {state ? ( // Check if user is logged in
                user ? (
                  <div>
                    {/* Check if user image is available */}
                    {user.imageUrl ? (
                      <div className='img-container'>
                        <img className='candlelight' src={candlelight} alt="candlelight" />
                        <img className='imagedata' src={user.imageUrl} alt="User" />
                      </div>
                    ) : (
                      <div className='no-image-container'>
                        <p>No Image Available</p>
                      </div>
                    )}

                    {/* <h1 className='home_user'>Welcome: <span className=''>{user.name}</span></h1> */}
                    <h1 class='home_user'>
                      <span class='welcome-text'>Welcome: </span>
                      <span class='user-name'>{user.name}</span>
                    </h1>

                    <h3 className='home_user'>
                      <span class='welcome-text'>Professional: </span>
                      <span class='user-name'>{user.work}</span>
                    </h3>
                    <p className="description">Keep Visiting this website to find your perfect partner based on data you provided</p>
                  </div>
                ) : (
                  <div>
                    <h1 className="home_user">Loading...</h1>
                  </div>
                )
              ) : (
                <div>
                  <img className='img-fluid meeting' src={meeting} alt="meeting" />
                  <h1 className="initial_home_user">Please Login to continue using this website <br/> Looking For Love? </h1>
                  <p className="description">Here you will find the perfect partner</p>
                </div>
              )}

              {/* <Heart />  */}
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="container_footer">
          <p>Discover Your Perfect Match <br /> <strong>&copy; findyourperfectmatch.com 2024</strong></p>
        </div>
      </footer>
    </div>
  );
};
