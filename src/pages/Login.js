import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import ConfirmationPage from './ConfirmationPage'; 

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:9090/api/auth/login', { username, password });
      if (response.data === "Login successful") {
        const token = "some_generated_token"; 
        onLogin(token);
        setIsConfirmed(true);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
      }
    } catch (error) {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
      console.error('There was an error logging in!', error);
    }
  };

  useEffect(() => {
    return () => clearTimeout(); 
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-beige">
      {isConfirmed ? (
        <ConfirmationPage />
      ) : (
        <div className="max-w-md w-full bg-white p-8 shadow-lg rounded">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-12 w-auto"
              src="https://www.rekrute.com/rekrute/file/jobOfferLogo/jobOfferId/154288"
              alt="SGABS"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none sm:text-sm sm:leading-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Sign in
                </button>
              </div>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account? <Link to="/signup" className="text-red-600 hover:underline">Sign up here</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
