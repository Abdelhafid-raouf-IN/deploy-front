import React, { useState } from 'react';
import axios from 'axios';

const TokenSidebar = ({ authBridgeUrl, setToken }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [grantType, setGrantType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [scope, setScope] = useState('');

  const generateToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const formData = new URLSearchParams();
      formData.append('grant_type', grantType);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('scope', scope);

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const response = await axios.post(authBridgeUrl, formData, { headers });

      if (response.status === 200) {
        const accessToken = response.data.access_token;
        setToken(accessToken); // Update parent component with the generated token
        setLoading(false);
      } else {
        setError('Failed to generate token');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error generating token:', error);
      setError('Failed to generate token');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Token Generation</h2>

      <div className="mb-4">
        <label htmlFor="grantType" className="block text-sm font-medium text-gray-900 mb-1">Grant Type</label>
        <input
          type="text"
          id="grantType"
          value={grantType}
          onChange={(e) => setGrantType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-1">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="scope" className="block text-sm font-medium text-gray-900 mb-1">Scope</label>
        <input
          type="text"
          id="scope"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
        />
      </div>

      <button
        className="w-full py-2 px-4 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:outline-none"
        onClick={generateToken}
        disabled={loading}
      >
        {loading ? 'Generating Token...' : 'Generate Token'}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default TokenSidebar;
