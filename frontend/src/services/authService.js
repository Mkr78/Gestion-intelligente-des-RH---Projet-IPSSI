// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}token/`, { username, password });
        localStorage.setItem('token', response.data.access);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = () => {
    return localStorage.getItem('token');
};
