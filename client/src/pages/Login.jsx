import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { userContext } from '../App';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, dispatch } = useContext(userContext);
  const navigation = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      return window.alert("Please Fill all the details...");
    }
  
    const URI = 'http://localhost:3000/user/signin';
  
    try {
      const res = await fetch(URI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: 'include', // Include this line  
      });


      const data = await res.json();
  
      if (res.status === 200 && data.status === "SUCCESS") {
        const { token, userId } = data;

        // Store the token in localStorage
        localStorage.setItem('jwtoken', token);

        // Dispatch user action to update context
        dispatch({ type: "USER", payload: true });

        // Redirect to user's profile or another authenticated route
        navigation('/myprofile');
        
        window.alert("Login Successfully");
      } else {
        window.alert("Invalid Credential...");
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle other errors as needed
    }
  };
 

  return (
    <div className="mask d-flex align-items-center h-100 gradient-custom-3 mt-5">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="card">
              <div className="card-body p-5">
                <h2 className="text-uppercase text-center mb-5">Welcome to Login Page</h2>

                {/* image for login page  */}
                <div className='form-outline'>
                  <img src="" alt='image' className='img-fluid' />
                </div>

                {/* Login page credentials  */}
                <form method='POST' className='signin-form' id='signin-form'>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="signinformyouremail"><i className="zmdi zmdi-email"></i> Email</label>
                    <input type="email" name='email' id="signinformyouremail" className="form-control form-control-lg" placeholder='Enter your email' autoComplete='off'
                     value={email}
                     onChange= { (e) => setEmail(e.target.value)} required />
                  </div>

                  <div className="mb-4">
                    <label className="form-label" htmlFor="signinformyourpassword"><i className="zmdi zmdi-lock"></i> Password</label>
                    <input type="password" name='password' id="signinformyourpassword" className="form-control form-control-lg" placeholder='Enter password' autoComplete='off'
                     value={password}
                     onChange= { (e) => setPassword(e.target.value)} required />
                  </div>

                  <div className="form-group form-button">
                    <input type='submit' name='signin' id="signin" className='form-submit button-color btn btn-primary btn-lg' value="Login" onClick={loginUser} />
                  </div>
                </form>

                <div className="form-outline">
                  <NavLink to="/register" className="navlink_login"><i className="zmdi zmdi-flower"></i> create account for free</NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
