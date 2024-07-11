import React from 'react';
import { Routes, Route, Navigate, useLocation  } from 'react-router-dom';
import ApiTestForm from '../pages/ApiTester';
import ApiTestResults from '../pages/TestResultsTable ';
import Navbar from '../components/NavBar';
import CheckApi from '../pages/ApiCheck';
import ApiTestAll from '../pages/ApiTesterAll';
import Banners from '../components/Banners';
import LoginPage from '../pages/Login';
import SignUpPage from '../pages/SignUpPage';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import TestResultsTable from '../pages/TestResultsTable ';
import HealthStatus from '../pages/Chart'
import '../style/styles.css';
import MetricsDashboard from '../pages/MetricsDashboard';
import AdminUserManagement from '../pages/AdminUserManagement ';

export const AuthenticatedApp = ({ results, setResults, onLogout }) => {
  const location = useLocation();

  // Function for test pass notification
  const testPassNotification = () => {
    console.log('Test passed successfully');
  };

  // Function for test fail notification
  const testFailNotification = () => {
    console.log('Test failed');
  };

  const showSidebar = ['/api-test', '/testallapis'].includes(location.pathname);

  return (
    <>
      <Navbar isAuthenticated={true} onLogout={onLogout} />
      <Banners />
      {showSidebar && <Sidebar />}
      <div className={`p-8 ${showSidebar ? 'pl-64' : ''}`}>
        <Routes>
          <Route path="/check-apis" element={<CheckApi />} />
          <Route path="/api-test" element={<ApiTestAll />} />
          <Route path="/resultat" element={<Dashboard />} />  
          <Route path="/testresults" element={<TestResultsTable />} />
          <Route path="/health" element={<HealthStatus />} />
          <Route path="/metrice" element={<MetricsDashboard />} />
          <Route path="/admin" element={<AdminUserManagement />} />



          <Route
            path="/testallapis"
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
    <Route
      path="/login"
      element={<LoginPage onLogin={handleLogin} redirectPath="/check-apis" />} />
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
