import { NavLink } from "react-router-dom";
import './Navbar.css';
import { useContext, useState } from "react";
import { userContext } from '../App';


export const Navbar = () => {

    const { state, dispatch } = useContext(userContext); // getting state value from login and logout page  

    const RenderMenu = () => {
        if (!state) { // is state is false i.e user is not login
            return (
                <>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/register">Registration</NavLink></li>
                    <li><NavLink to="/login">Login</NavLink></li>

                </>
            )
        }

        else {
            return (
                <>

                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/blog">Blog</NavLink></li>
                    <li><NavLink to="/about">Your Data</NavLink></li>
                    <li><NavLink to="/myprofile">My Profile</NavLink></li>
                    <li><NavLink to="/contact">Contact us</NavLink></li>
                    <li><NavLink to="/logout">Logout</NavLink></li>

                </>
            )
        }
    }


    return <>
        <header>
            <nav class="navbar navbar-expand-lg my_navbar">
                <div class="container-fluid">
                    <a class="navbar-brand">Find Perfect Partner</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                            <RenderMenu />

                        </ul>

                    </div>
                </div>
            </nav>
        </header>
    </>
}