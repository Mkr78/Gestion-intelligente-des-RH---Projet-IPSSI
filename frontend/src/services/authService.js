import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/users/login/';

export const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL, { email, password });
        // Stocker le token dans localStorage
        console.log("token",response.data.token.access);
        console.log("data",response.data);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user as a JSON string
        localStorage.setItem('token', response.data.token.access);  // Remarquez l'utilisation de `token` au lieu de `access`
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const clearToken = () => {
    localStorage.removeItem('token');
};

export const getToken = () => {
    return localStorage.getItem('token');
};
