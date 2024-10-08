import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Heading,
    Text,
    VStack,
} from '@chakra-ui/react';
import Swal from 'sweetalert2';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [first_name, setFirst_name] = useState("")
    const [last_name, setLast_name] = useState("")
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (password !== password2) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Les mots de passe ne correspondent pas',
            });
            return;
        }
    
        try {
            // Envoyer la requête et capturer la réponse
            const response = await axios.post('http://127.0.0.1:8000/api/users/register/', {
                first_name,
                last_name,
                username,
                email,
                password,
                password2
            });
    
            // Vérifiez la réponse pour le statut et le message
            if (response.data) {
                console.log("Réponse :", response.data);
    
                Swal.fire({
                    icon: 'success',
                    title: 'Succes',
                    text: response.data.message || 'Inscription réussie !',
                }).then(() => {
                    navigate('/login');
                });
            } 
            
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Échec',
                text: 'Échec de l\'inscription',
            });
        }
    };

    return (
        <Box
            maxW="md"
            mx="auto"
            mt={10}
            p={5}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
        >
            <Heading as="h2" size="lg" textAlign="center" mb={6}>
                Inscription
            </Heading>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                <FormControl id="first_name" isRequired>
                        <FormLabel>First name</FormLabel>
                        <Input
                            type="text"
                            value={first_name}
                            onChange={(e) => setFirst_name(e.target.value)}
                            placeholder="Firstname"
                        />
                    </FormControl>

                    <FormControl id="last_name" isRequired>
                        <FormLabel>Last name</FormLabel>
                        <Input
                            type="text"
                            value={last_name}
                            onChange={(e) => setLast_name(e.target.value)}
                            placeholder="Lastname"
                        />
                    </FormControl>

                    <FormControl id="username" isRequired>
                        <FormLabel>Nom d'utilisateur</FormLabel>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nom d'utilisateur"
                        />
                    </FormControl>

                    <FormControl id="email" isRequired>
                        <FormLabel>Adresse e-mail</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Adresse e-mail"
                        />
                    </FormControl>

                    <FormControl id="password" isRequired>
                        <FormLabel>Mot de passe</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mot de passe"
                        />
                    </FormControl>

                    <FormControl id="password2" isRequired>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <Input
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            placeholder="Confirmer le mot de passe"
                        />
                    </FormControl>

                    <Button colorScheme="teal" type="submit" width="full">
                        S'inscrire
                    </Button>
                </VStack>
            </form>
            {error && <Text color="red.500" mt={4}>{error}</Text>}
            {success && <Text color="green.500" mt={4}>{success}</Text>}
        </Box>
    );
};

export default RegisterForm;
