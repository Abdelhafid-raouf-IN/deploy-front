import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SwaggerClient from 'swagger-client';
import { apiDocs } from '../data/apiDocs'; // Assurez-vous d'importer correctement vos données apiDocs

const ApiTestAll = ({ testPassNotification, testFailNotification }) => {
  const [apis, setApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState('');
  const [endpoints, setEndpoints] = useState({});
  const [selectedEndpoints, setSelectedEndpoints] = useState([]);
  const [baseApiUrl, setBaseApiUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [token, setToken] = useState('');
  const [body, setBody] = useState('');
  const [responseResults, setResponseResults] = useState({});

  useEffect(() => {
    const loadApis = async () => {
      const apiData = [];
      try {
        for (const apiDoc of apiDocs) {
          const client = await SwaggerClient(apiDoc.url);
          apiData.push({
            name: apiDoc.name,
            client,
            baseUrl: apiDoc.base_url,
          });
        }
        setApis(apiData);
      } catch (error) {
        console.error('Error loading APIs:', error);
      }
    };
    loadApis();
  }, []);

  useEffect(() => {
    if (selectedApi) {
      const api = apis.find((a) => a.name === selectedApi);
      if (api) {
        const paths = api.client.spec.paths;
        setEndpoints(paths);
        setBaseApiUrl(api.baseUrl);
      }
    }
  }, [selectedApi, apis]);

  const handleSubmitAll = async (event) => {
    event.preventDefault();
    try {
      const results = {};
      for (const endpoint of selectedEndpoints) {
        const endpointDetails = endpoints[endpoint][method.toLowerCase()];
        if (endpointDetails) {
          const fullUrl = `${baseApiUrl}${endpoint}`;
          const options = {
            method: method,
            url: fullUrl,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            validateStatus: function (status) {
              return status < 500;
            },
          };
          if (method === 'POST' || method === 'PUT') {
            options.data = JSON.parse(body); // Parse the body input
          }
          const response = await axios(options);
          results[endpoint] = response.data;
        }
      }
      setResponseResults(results);
      testPassNotification();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        testFailNotification();
      } else {
        console.error('Error during API calls:', error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">API Test Form - Multiple Endpoints</h2>
          <span className="text-sm font-medium text-gray-600">Tester plusieurs endpoints d'une API</span>
        </div>

        <form onSubmit={handleSubmitAll} id="apiFormAll">
          <div className="mb-4">
            <label htmlFor="api" className="block text-sm font-medium text-gray-900 mb-1">Select API</label>
            <select
              id="api"
              onChange={(e) => setSelectedApi(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
            >
              <option value="">Select an API</option>
              {apis.map((api) => (
                <option key={api.name} value={api.name}>{api.name}</option>
              ))}
            </select>
          </div>

          {selectedApi && (
            <>
              <div className="mb-4">
                <label htmlFor="endpoints" className="block text-sm font-medium text-gray-900 mb-1">Select Endpoints</label>
                <select
                  id="endpoints"
                  onChange={(e) => setSelectedEndpoints(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
                  multiple
                >
                  {Object.keys(endpoints).map((endpoint) => (
                    <option key={endpoint} value={endpoint}>{endpoint}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="method" className="block text-sm font-medium text-gray-900 mb-1">Method</label>
                  <select
                    id="method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-900 mb-1">Access Token</label>
                  <input
                    type="text"
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              {(method === 'POST' || method === 'PUT') && (
                <div className="mb-4">
                  <label htmlFor="body" className="block text-sm font-medium text-gray-900 mb-1">Request Body</label>
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
                    rows="5"
                    placeholder='{"key": "value"}'
                    required
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 ml-4 text-sm font-semibold text-white bg-green-700 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Test All Endpoints
                </button>
              </div>
            </>
          )}

          {Object.keys(responseResults).length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">API Response for Each Endpoint:</h3>
              {Object.keys(responseResults).map((endpoint) => (
                <div key={endpoint} className="mb-4">
                  <h4 className="text-md font-semibold mb-1">Endpoint: {endpoint}</h4>
                  <pre className="bg-gray-100 p-4 rounded-md">
                    {JSON.stringify(responseResults[endpoint], null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApiTestAll;
