import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/login">Connexion</Link></li>
                <li><Link to="/register">Inscription</Link></li>
                <li><Link to="/candidates">Candidats</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
