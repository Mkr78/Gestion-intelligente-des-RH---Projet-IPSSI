import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../services/authService';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default Logout;
