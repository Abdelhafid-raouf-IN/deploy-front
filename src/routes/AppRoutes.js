import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ApiTestForm from '../pages/ApiTester';
import ApiTestResults from '../pages/ApiTestResults';
import Navbar from '../components/NavBar';
import CheckApi from '../pages/ApiCheck';
import ApiTestAll from '../pages/ApiTesterAll';
import Banners from '../components/Banners';
import LoginPage from '../pages/Login';
import SignUpPage from '../pages/SignUpPage';
import Sidebar from '../components/Sidebar';
import '../style/styles.css'; // Assurez-vous que votre fichier CSS est bien importé

export const AuthenticatedApp = ({ results, setResults, onLogout }) => {
  // Function for test pass notification
  const testPassNotification = () => {
    console.log('Test passed successfully');
  };

  // Function for test fail notification
  const testFailNotification = () => {
    console.log('Test failed');
  };

  return (
    <>
      <Navbar isAuthenticated={true} onLogout={onLogout} />
      <Banners />
      <Sidebar/>
      <div className="p-8">
        <Routes>
          <Route path="/check-apis" element={<CheckApi />} />
          <Route path="/testallapis" element={<ApiTestAll />} />
          <Route
            path="/api-test"
            element={
              <>
                <h1 className="text-3xl font-bold text-center mb-8">API Tester</h1>
                <ApiTestForm
                  setResults={setResults}
                  testPassNotification={testPassNotification}
                  testFailNotification={testFailNotification}
                />
                {results && <ApiTestResults results={results} />}
              </>
            }
          />
        </Routes>
        </div>
    </>
  );
};

const AppRoutes = ({ isAuthenticated, handleLogin, results, setResults, handleLogout }) => (
  <Routes>
    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route
      path="/*"
      element={
        isAuthenticated ? (
          <AuthenticatedApp
            results={results}
            setResults={setResults}
            onLogout={handleLogout}
          />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  </Routes>
);

export default AppRoutes;