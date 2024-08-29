import React, { useState } from 'react';
import { Button, Input, FormControl, FormLabel, Box, Text } from '@chakra-ui/react';
import { login } from '../services/authService';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(email, password);
            window.location.href = '/';
        } catch (err) {
            setError('Échec de la connexion');
        }
    };

    return (
        <Box maxW="sm" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <form onSubmit={handleSubmit}>
                <FormControl id="email" mb={4}>
                    <FormLabel>Adresse email</FormLabel>
                    <Input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Adresse email"
                    />
                </FormControl>
                <FormControl id="password" mb={4}>
                    <FormLabel>Mot de passe</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                    />
                </FormControl>
                <Button type="submit" colorScheme="teal" width="full">
                    Se connecter
                </Button>
                {error && <Text color="red.500" mt={2}>{error}</Text>}
            </form>
        </Box>
    );
};

export default LoginForm;
