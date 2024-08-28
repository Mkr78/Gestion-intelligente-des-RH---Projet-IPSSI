import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CandidatesPage() {
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/candidates/')
            .then(response => setCandidates(response.data))
            .catch(error => setError('Erreur lors de la récupération des candidats.'));
    }, []);

    return (
        <div>
            <h1>Liste des candidats</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {candidates.map(candidate => (
                    <li key={candidate.id}>{candidate.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default CandidatesPage;
