import React, { useState } from 'react';
import { login } from '../services/authService';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(username, password);
            window.location.href = '/'; // Rediriger après la connexion
        } catch (err) {
            setError('Échec de la connexion');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
            />
            <button type="submit">Se connecter</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default LoginForm;
