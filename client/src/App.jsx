import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import Logout from "./pages/Logout";
import { Registration } from "./pages/Registration";
import { Blog } from "./pages/Blog";
import { About } from "./pages/About";
import { ContactUs } from "./pages/Contact";
import Myprofile from "./pages/Myprofile";
import { createContext, useReducer } from "react";

import { initialState, reducer } from "./reducer/useReducer";


// 1. create context()

export const userContext = createContext();

const App = () => {


  // 3. use useReducer() for update the value of state

  const [state, dispatch] = useReducer(reducer, initialState)


  return (

    // 2. now use Provider after creating useContext()

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
        </Routes>

      </BrowserRouter>
    </userContext.Provider>

  );
};

export default App;
