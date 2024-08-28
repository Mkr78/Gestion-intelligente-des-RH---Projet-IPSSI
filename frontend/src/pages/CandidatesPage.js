import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/authService';

function CandidatesPage() {
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = () => {
        axios.get('http://localhost:8000/api/candidates/', {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            }
        })
        .then(response => {
            setCandidates(response.data);
            setError('');
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des candidats:', error);
            setError('Erreur lors de la récupération des candidats.');
        });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/api/candidates/${id}/`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            }
        })
        .then(() => {
            setSuccess('Candidature supprimée avec succès.');
            setCandidates(candidates.filter(candidate => candidate.id !== id));
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de la candidature:', error);
            setError('Erreur lors de la suppression de la candidature.');
        });
    };

    return (
        <div>
            <h1>Liste des candidats</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <ul>
                {candidates.map(candidate => (
                    <li key={candidate.id}>
                        {candidate.name}
                        <button onClick={() => handleDelete(candidate.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CandidatesPage;
