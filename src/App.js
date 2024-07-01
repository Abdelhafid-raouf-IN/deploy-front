import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/AppRoutes'; // Import AppRoutes from routes.js
const App = () => {
  const [results, setResults] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    // Check if the user is authenticated
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false); // Set loading to false after checking
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true'); // Save authentication state in localStorage
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // Remove authentication state from localStorage
  };

  if (loading) {
    // Render a loading spinner or placeholder while checking authentication
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <AppRoutes
          isAuthenticated={isAuthenticated}
          handleLogin={handleLogin}
          results={results}
          setResults={setResults}
          handleLogout={handleLogout}
        />
      </div>
    </Router>
  );
};

export default App;
