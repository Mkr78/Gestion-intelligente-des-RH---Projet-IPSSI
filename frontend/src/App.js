import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CandidatesPage from './pages/CandidatesPage';
import PrivateRoute from './components/PrivateRoute';
import LayoutWithSidebar from './layouts/LayoutWithSidebar'; // Importez le layout
import Dashboard from './pages/Recruiters/Dashboard';
import AddRecruiter from './pages/Recruiters/AddRecruiter';

function App() {
    return (
        <ChakraProvider>
            <Router>
                {/* La Navbar est en dehors des Routes, elle sera donc visible sur toutes les pages */}
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Utilisez LayoutWithSidebar pour les routes qui doivent avoir la barre latérale */}
                    <Route path="/" element={<LayoutWithSidebar />}>
                        {/* Routes enfants ici */}
                        <Route
                            path="candidates"
                            element={<PrivateRoute element={<CandidatesPage />} />}
                        />
                         <Route
                            path="dashboard"
                            element={<PrivateRoute element={<Dashboard />} />}
                        />
                         <Route
                            path="add_recruiter"
                            element={<PrivateRoute element={<AddRecruiter />} />}
                        />
                        {/* Ajoutez d'autres routes enfants ici si nécessaire */}
                    </Route>
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;
