import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/candidates/')
            .then(response => setCandidates(response.data))
            .catch(error => console.error('There was an error fetching the candidates!', error));
    }, []);

    return (
        <div>
            <h1>Candidate List</h1>
            <ul>
                {candidates.map(candidate => (
                    <li key={candidate.id}>{candidate.name} - {candidate.score}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
