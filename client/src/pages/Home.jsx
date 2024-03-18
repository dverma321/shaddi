import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import heartTreeImage from '../images/heart_tree.png';
import '../pages/Home.css';
import '../components/Heart'
import Heart from '../components/Heart';

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
                  <h1 className='home_user'> Welcome: {user.name} </h1>
                  {/* <h2 className='text-black'>Phone: {user.phone}</h2> */}
                  <h3 className='home_work'>Professional: {user.work}</h3> 
                  <p className="description">Keep Visiting this website to find your perfect partner based on data you provided</p>
                </div>
              ) : (
                <div>
                  <h1 className="home_user">Please Login to continue using this website</h1>
                  <p className="description">Here you will find the perfect partner</p>
                </div>
              )}

              {/* Rendering falling images  */}
              <Heart />

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
