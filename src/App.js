import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUpPage';
import './App.css';
import { AuthenticatedApp } from './routes/AppRoutes'; // Importer AuthenticatedApp depuis le router

const App = () => {
  const [results, setResults] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Récupérer les informations d'authentification du localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (authToken) => {
    // Vérifier si authToken est valide avant de mettre à jour l'état d'authentification
    if (authToken) {
      setIsAuthenticated(true);
      setToken(authToken);
      localStorage.setItem('token', authToken); // Sauvegarder le token dans le localStorage
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken('');
    localStorage.removeItem('token'); // Supprimer le token du localStorage
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* Utilisation de la route protégée définie dans le router.js */}
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <AuthenticatedApp
                  results={results}
                  setResults={setResults}
                  token={token}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
