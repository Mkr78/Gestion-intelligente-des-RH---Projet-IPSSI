import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCandidate() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [resume, setResume] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); // Assurez-vous d'ajouter le token d'authentification

        axios.post('http://localhost:8000/api/candidates/', {
            name,
            email,
            resume,
            cover_letter: coverLetter
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            navigate('/candidates');
        })
        .catch(error => {
            setError('Erreur lors de l\'ajout de la candidature.');
            console.error('There was an error adding the candidate!', error);
        });
    };

    return (
        <div>
            <h2>Ajouter une candidature</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nom" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <textarea 
                    placeholder="Résumé" 
                    value={resume} 
                    onChange={(e) => setResume(e.target.value)} 
                />
                <textarea 
                    placeholder="Lettre de motivation" 
                    value={coverLetter} 
                    onChange={(e) => setCoverLetter(e.target.value)} 
                />
                <button type="submit">Ajouter</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default AddCandidate;
