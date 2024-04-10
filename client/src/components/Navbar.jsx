import { NavLink } from "react-router-dom";
import './Navbar.css';
import { useContext, useState } from "react";
import { userContext } from '../App';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



export const Navbar = () => {

    const { state, dispatch } = useContext(userContext); // getting state value from login and logout page  

    const RenderMenu = () => {
        if (!state) { // is state is false i.e user is not login
            return (
                <>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/register">Registration</NavLink></li>
                    <li><NavLink to="/login">Login</NavLink></li>
                    <li><NavLink to="/yourmatching">Find Partner</NavLink></li>

                </>
            )
        }

        else {
            return (
                <>

                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/yourmatching">Find Partner</NavLink></li>
                    <li><NavLink to="/chatting">Global Chats</NavLink></li>
                    <li><NavLink to="/about">My Information</NavLink></li>
                    <li><NavLink to="/myprofile">Update Profile</NavLink></li>
                    {/* <li><NavLink to="/yourimage">Upload Photo</NavLink></li> */}
                    <li><NavLink to="/contact">Contact us</NavLink></li>
                    <li><NavLink to="/logout">Logout</NavLink></li>

                </>
            )
        }
    }


    return (
        <header>
            <nav className="navbar navbar-expand-lg my_navbar">
                <div className="container-fluid">
                    <p className="logo">Find Perfect Partner</p>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <RenderMenu />

                        </ul>

                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
