import React, { useState } from 'react';
import { Button, Input, FormControl, FormLabel, Box, Text } from '@chakra-ui/react';
import { login } from '../services/authService';
import { FacebookFilled, HomeOutlined, InstagramFilled, MailOutlined, PhoneOutlined, TwitterCircleFilled } from '@ant-design/icons';
import logo from '../layouts/logo.png'
import { Image } from 'antd';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(email, password);
    
            const user = JSON.parse(localStorage.getItem('user'));
    
            if (user.role === 'recruiter') {
                window.location.href = '/candidates';
            } else if (user.role === 'admin') {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setError('Échec de la connexion');
        }
    };
    return (
       <div>
         <div style={{ backgroundColor: '#bd0402' }}>
                <div style={{ justifyContent: 'space-between', display: 'flex', backgroundColor: '#bd0402', width: '80%', alignSelf: 'center', margin: 'auto' }}>
                    {/* first part  */}
                    <div style={{ backgroundColor: '#bd0402', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 5 }}>
                        <p style={{ textAlign: 'start', margin: 0, color: 'white', fontSize: 14, fontFamily: 'revert-layer', marginRight: 10 }}> <MailOutlined style={{ fontSize: 14 }} /> contact@email.com</p>
                        <br />
                        <p style={{ textAlign: 'start', margin: 0, color: 'white', fontSize: 14, marginLeft: 5, fontFamily: 'revert-layer' }}> <PhoneOutlined style={{ fontSize: 14 }} /> +33 07 6074 1111</p>
                    </div>
                    {/* second part  */}
                    <div style={{ backgroundColor: '#bd0402', display: 'flex', justifyContent: 'flex-start', padding: 5 }}>
                        <TwitterCircleFilled style={{ marginRight: 10, color: 'white', }} />
                        <FacebookFilled style={{ marginRight: 10, color: 'white' }} />
                        <InstagramFilled style={{ marginRight: 5, color: 'white' }} />
                    </div>
                </div>
            </div>
            <div className="demo-logo" style={{ display: 'flex',marginRight:30,
                 justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
  <Image src={logo} width={150} preview={false} />
</div>
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
                <Button type="submit" style={{backgroundColor:'#bd0402',color:'white'}} width="full">
                    Se connecter
                </Button>
                <p style={{marginTop:10}}>Don't have an account? <a style={{textDecoration:'underline',color:'gray'}} href="/register">Register here!</a></p>
                {error && <Text color="red.500" style={{textAlign:'center'}} mt={2}>{error}</Text>}
            </form>
        </Box>
       </div>
    );
};

export default LoginForm;
