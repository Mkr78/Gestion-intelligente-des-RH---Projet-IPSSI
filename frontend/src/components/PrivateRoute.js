import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../services/authService';

const PrivateRoute = ({ element: Component }) => {
    const location = useLocation();
    const token = getToken();

    if (!token) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Render the protected component
    return Component;
};

export default PrivateRoute;
