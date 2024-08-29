import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/authService';
import {
    Box,
    Button,
    Heading,
    List,
    ListItem,
    Text,
    useToast,
} from '@chakra-ui/react';

function CandidatesPage() {
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const toast = useToast();

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
            toast({
                title: "Erreur",
                description: "Erreur lors de la récupération des candidats.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
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
            toast({
                title: "Succès",
                description: "Candidature supprimée avec succès.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de la candidature:', error);
            setError('Erreur lors de la suppression de la candidature.');
            toast({
                title: "Erreur",
                description: "Erreur lors de la suppression de la candidature.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        });
    };

    return (
        <Box p={5}>
            <Heading as="h1" mb={5}>Liste des candidats</Heading>
            {error && <Text color="red.500">{error}</Text>}
            {success && <Text color="green.500">{success}</Text>}
            <List spacing={3}>
                {candidates.map(candidate => (
                    <ListItem
                        key={candidate.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderWidth="1px"
                        borderRadius="lg"
                        p={4}
                        mb={2}
                    >
                        <Text>{candidate.name}</Text>
                        <Button
                            colorScheme="red"
                            onClick={() => handleDelete(candidate.id)}
                        >
                            Supprimer
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default CandidatesPage;
