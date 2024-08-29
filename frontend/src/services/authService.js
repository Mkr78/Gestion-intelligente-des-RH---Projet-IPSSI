import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/users/login/';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}`, { email, password });
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

export const clearToken = () => {
    localStorage.removeItem('token');
};

export const getToken = () => {
    return localStorage.getItem('token');
};
