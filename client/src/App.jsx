import React, { createContext, useEffect, useReducer } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Heart from './components/Heart';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import Logout from './pages/Logout';
import { Registration } from './pages/Registration';
import { Blog } from './pages/Blog';
import About from './pages/About';
import { ContactUs } from './pages/Contact';
import Myprofile from './pages/Myprofile';
import Match from './pages/Match';
import ImageUpload from './pages/ImageUpload';

import { initialState, reducer } from './reducer/useReducer';

export const userContext = createContext();

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('jwtoken'); // Check if token exists in local storage
    if (token) {
      // If token exists, dispatch an action to set the user state
      dispatch({ type: 'USER', payload: true });
    }
  }, []);

  return (
    <userContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/myprofile" element={<Myprofile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/heart" element={<Heart />} />
          <Route path="/yourmatching" element={<Match />} />
          <Route path="/yourimage" element={<ImageUpload />} />
          
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
};

export default App;
