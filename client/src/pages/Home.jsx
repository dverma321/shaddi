import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import heartTreeImage from '../images/heart_tree.png';
import '../pages/Home.css';

export const Home = () => {
  const [user, setUser] = useState(null);  

  const callGetData = async () => {
    try {
      const URI = 'http://localhost:3000/user/getData';
      const res = await fetch(URI, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }
      const data = await res.json();
      setUser(data.name); // Assuming data is { name: 'user name' }
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
                  <h1 className="text-black">Welcome {user}</h1>
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
