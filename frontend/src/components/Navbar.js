// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';

function Navbar() {
    return (
        <nav>
            <Link to="/candidates">Candidates</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Logout />
        </nav>
    );
}

export default Navbar;
