import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import heartTreeImage from '../images/heart_tree.png';
import '../pages/Home.css';

export const Home = () => {
  const [user, setUser] = useState(null);

  const callGetData = async () => {
    try {
      const token = localStorage.getItem('jwtoken'); // get token from local storage
      const backendURL = 'http://localhost:3000'; // Backend / server URL fix
  
      const res = await fetch(`${backendURL}/user/getData`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // declare and include Authorization token is necessary because it will fetch information from backend
        },
        credentials: 'include', // it is also necessary to include credential otherwise jwtoken authorization will fail
      });

      const data = await res.json(); // Parse JSON response
      setUser(data); // Update user state with the user property from the response
  
      // Handle response...
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
              {user ? (
                <div>
                  <div className='img-fluid imagedata'><img src={user.image}/></div>
                  <h1 className="text-black">Welcome {user.name}</h1>
                  <h2 className='text-black'>Phone: {user.phone}</h2>
                  <h3 className='text-black'>Work: {user.work}</h3>
                  <p className="lead lead-md text-black">Here you will find the perfect partner</p>
                </div>
              ) : (
                <div>
                  <h1 className="text-black">Welcome User</h1>
                  <p className="lead lead-md text-black">Here you will find the perfect partner</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="container">
          <p>Footer content goes here</p>
        </div>
      </footer>
    </div>
  );
};
