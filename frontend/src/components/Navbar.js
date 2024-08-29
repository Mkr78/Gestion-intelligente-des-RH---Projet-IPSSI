import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Button } from '@chakra-ui/react';
import Logout from './Logout';

function Navbar() {
    return (
        <Box bg="teal.500" p={4} color="white">
            <Flex justify="space-between">
                <Box>
                    <Link to="/candidates">
                        <Button variant="link" color="white" mr={4}>
                            Candidates
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="link" color="white" mr={4}>
                            Login
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="link" color="white" mr={4}>
                            Register
                        </Button>
                    </Link>
                </Box>
                <Logout />
            </Flex>
        </Box>
    );
}

export default Navbar;
