import React from 'react';
import { Routes, Route,} from 'react-router-dom';
import ApiTestForm from '../pages/ApiTester';
import ApiTestResults from '../pages/ApiTestResults';
import Navbar from '../components/NavBar';
import CheckApi from '../pages/ApiCheck'; 
import ApiTestAll from '../pages/ApiTesterAll';
import Banners from '../components/Banners';

export const AuthenticatedApp = ({ results, setResults, token, onLogout }) => {
  // Fonction de notification de test réussi
  const testPassNotification = () => {
    console.log('Test passé avec succès');
  };

  // Fonction de notification de test échoué
  const testFailNotification = () => {
    console.log('Le test a échoué');
  };

  return (
    <>
      <Navbar isAuthenticated={true} onLogout={onLogout} />
      <Banners />
      <div className="p-8">
        <Routes>
        <Route path="/check-apis" element={<CheckApi />} />
        <Route path="/testallapis" element={<ApiTestAll />} />
        <Route
            path="/api-test"
            element={
              <>
                <h1 className="text-3xl font-bold text-center mb-8">Testeur d'API</h1>
                <ApiTestForm
                  setResults={setResults}
                  token={token}
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
