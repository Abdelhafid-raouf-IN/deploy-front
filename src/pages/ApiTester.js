import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SwaggerClient from 'swagger-client';
import '../style/styles.css';
import testRequests from '../data/testRequests.json';

const ApiAutoTesting = ({ testPassNotification, testFailNotification }) => {
  const [apis, setApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState('');
  const [endpoints, setEndpoints] = useState({});
  const [baseApiUrl, setBaseApiUrl] = useState('');
  const [token, setToken] = useState('');
  const [environment, setEnvironment] = useState([]);
  const [branch, setBranch] = useState('-');
  const [branches, setBranches] = useState([]);
  const [status, setStatus] = useState([]);
  const [isAutoTesting, setIsAutoTesting] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [testResults, setTestResults] = useState({ passed: [], failed: [] });
  const [currentTest, setCurrentTest] = useState(null);
  const [testingEndpoints, setTestingEndpoints] = useState([]);
  const [endpointStatus, setEndpointStatus] = useState({});
  const [selectedTestResult, setSelectedTestResult] = useState(null);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/branches');
        setBranches(response.data);
      } catch (error) {
        console.error('Error loading branches:', error);
      }
    };
    loadBranches();
  }, []);

  useEffect(() => {
    const loadApis = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/docs');
        const apiData = response.data.map(async (apiDoc) => {
          const client = await SwaggerClient(apiDoc.url);
          return {
            name: apiDoc.name,
            client,
            baseUrl: apiDoc.baseUrl
          };
        });
        const resolvedApiData = await Promise.all(apiData);
        setApis(resolvedApiData);
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

  const getRequestBody = (endpoint, method) => {
    return testRequests[endpoint] && testRequests[endpoint][method];
  };

  const runTest = async (endpoint, method) => {
    try {
      setCurrentTest({ endpoint, method });
      setTestingEndpoints((prev) => [...prev, { endpoint, method }]);
      const url = `${baseApiUrl}${endpoint}`;
      const requestBody = getRequestBody(endpoint, method);
      const options = {
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        data: requestBody,
        validateStatus: function (status) {
          return status < 500;
        },
      };
  
      const startTime = new Date();
      const response = await axios(options);
      const stopTime = new Date();
      const duration = stopTime - startTime;
  
      const testResult = {
        apiName: selectedApi,
        endpoint,
        method,
        status: response.status,
        responseBody: JSON.stringify(response.data, null, 2),
        responseHeaders: JSON.stringify(response.headers, null, 2),
        requestBody: JSON.stringify(requestBody, null, 2),
        curlCommand: `curl -X ${method} ${url} -H 'Authorization: Bearer ${token}' -d '${JSON.stringify(requestBody)}'`,
        environment: environment.join(', '),
        branch,
        startTime: startTime.toISOString(),  // Start Time
        stopTime: stopTime.toISOString(),    // Stop Time
        duration: duration,                 // Test Duration in milliseconds
        localDate: new Date().toISOString(),  // Local Date
      };
  
      await axios.post('http://localhost:9090/api/tests/save', testResult);
      setStatus(response.status);
  
      setEndpointStatus((prev) => ({
        ...prev,
        [`${endpoint}:${method}`]: response.status >= 200 && response.status < 300 ? '✔️' : '❌'
      }));
  
      if (response.status >= 200 && response.status < 300) {
        setTestResults((prev) => ({
          ...prev,
          passed: [...prev.passed, testResult],
        }));
        testPassNotification();
      } else {
        setTestResults((prev) => ({
          ...prev,
          failed: [...prev.failed, testResult],
        }));
        testFailNotification();
      }
    } catch (error) {
      const failedTestResult = {
        apiName: selectedApi,
        endpoint,
        method,
        status: error.response ? error.response.status : 'Network Error',
        responseBody: error.response ? JSON.stringify(error.response.data, null, 2) : 'No response body',
        responseHeaders: error.response ? JSON.stringify(error.response.headers, null, 2) : 'No response headers',
        requestBody: JSON.stringify(getRequestBody(endpoint, method), null, 2),
        curlCommand: `curl -X ${method} ${baseApiUrl}${endpoint} -H 'Authorization: Bearer ${token}' -d '${JSON.stringify(getRequestBody(endpoint, method))}'`,
        environment: environment.join(', '),
        branch,
        startTime: new Date().toISOString(),  // Start Time
        stopTime: new Date().toISOString(),   // Stop Time
        duration: 0,                          // Set Duration to 0 for failed tests
        localDate: new Date().toISOString(),  // Local Date
      };
  
      setTestResults((prev) => ({
        ...prev,
        failed: [...prev.failed, failedTestResult],
      }));
      testFailNotification();
      setEndpointStatus((prev) => ({
        ...prev,
        [`${endpoint}:${method}`]: '❌'
      }));
    } finally {
      setTestingEndpoints((prev) =>
        prev.filter((test) => !(test.endpoint === endpoint && test.method === method))
      );
      setCurrentTest(null);
    }
  };
  

  const handleTestResultClick = (testResult) => {
    setSelectedTestResult(testResult);
  };

  const startAutoTesting = () => {
    if (intervalId) return;

    const endpointsArray = Object.keys(endpoints).flatMap((endpoint) =>
      Object.keys(endpoints[endpoint]).map((method) => ({ endpoint, method }))
    );

    const id = setInterval(() => {
      if (endpointsArray.length > 0) {
        const nextTest = endpointsArray.shift();
        runTest(nextTest.endpoint, nextTest.method);
      }
    }, 30000);

    setIntervalId(id);
    setIsAutoTesting(true);
  };

  const stopAutoTesting = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsAutoTesting(false);
    }
  };

  const handleTestAllEndpoints = async () => {
    const endpointsArray = Object.keys(endpoints).flatMap((endpoint) =>
      Object.keys(endpoints[endpoint]).map((method) => ({ endpoint, method }))
    );

    for (const { endpoint, method } of endpointsArray) {
      await runTest(endpoint, method);
    }
  };

  const handleCheckboxChange = useCallback((event, value) => {
    if (event.target.checked) {
      setEnvironment((prev) => [...prev, value]);
    } else {
      setEnvironment((prev) => prev.filter((env) => env !== value));
    }
  }, []);

  const isFormValid = selectedApi && token && environment.length > 0 && branch !== '-';

  return (
    <div className="flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">API Test Form</h2>
          <span className="text-sm font-medium text-gray-600">Testeur d'API</span>
        </div>

        <form onSubmit={(e) => e.preventDefault()} id="apiForm">
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
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4">
                <label htmlFor="environment" className="block text-sm font-medium text-gray-900 mb-2">Environment</label>
                <div className="flex items-center space-x-6">
                  {['DEV', 'HF', 'HT'].map((env) => (
                    <div className="flex items-center" key={env}>
                      <input
                        type="checkbox"
                        id={env}
                        checked={environment.includes(env)}
                        onChange={(e) => handleCheckboxChange(e, env)}
                        className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-600"
                      />
                      <label htmlFor={env} className="ml-2 text-sm font-medium text-gray-900">{env}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4">
                <label htmlFor="branch" className="block text-sm font-medium text-gray-900 mb-2">Branch</label>
                <select
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
                >
                  <option value="-">-</option>
                  {branches.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-900 mb-1">Token</label>
                <input
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}
          {selectedApi && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleTestAllEndpoints}
                disabled={!isFormValid}
                className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${isFormValid ? 'bg-indigo-600 text-white focus:ring-indigo-600' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
              >
                Start Auto Testing All Endpoints
              </button>
            </div>
          )}
        </form>

        {currentTest && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-900">Current Test:</div>
            <div className="text-sm text-gray-700">Endpoint: {currentTest.endpoint}</div>
            <div className="text-sm text-gray-700">Method: {currentTest.method}</div>
          </div>
        )}
        <div className="w-full mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">Test Results</h2>
          </div>

          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <ul className="list-disc list-inside">
                {testResults.passed.map((result, index) => (
                  <li key={index} onClick={() => handleTestResultClick(result)} className="cursor-pointer flex items-center">
                    <span className="text-green-500 text-xl mr-2">✅</span>
                    <span>{result.endpoint} [{result.method}]</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/2 pl-2">
              <ul className="list-disc list-inside">
                {testResults.failed.map((result, index) => (
                  <li key={index} onClick={() => handleTestResultClick(result)} className="cursor-pointer flex items-center">
                    <span className="text-red-500 text-xl mr-2">❌</span>
                    <span>{result.endpoint} [{result.method}]</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {selectedTestResult && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md shadow-md">
            <h4 className="text-md font-semibold text-gray-900">Test Result Details</h4>
            <p><strong>API Name:</strong> {selectedTestResult.apiName}</p>
            <p><strong>Endpoint:</strong> {selectedTestResult.endpoint}</p>
            <p><strong>Method:</strong> {selectedTestResult.method}</p>
            <p><strong>Status:</strong> {selectedTestResult.status}</p>
            <p><strong>Request Body:</strong></p>
            <pre className="bg-gray-200 p-2 rounded-md overflow-x-auto">{selectedTestResult.requestBody}</pre>
            <p><strong>Response Body:</strong></p>
            <pre className="bg-gray-200 p-2 rounded-md overflow-x-auto">{selectedTestResult.responseBody}</pre>
            <p><strong>Response Headers:</strong></p>
            <pre className="bg-gray-200 p-2 rounded-md overflow-x-auto">{selectedTestResult.responseHeaders}</pre>
            <p><strong>Curl Command:</strong></p>
            <pre className="bg-gray-200 p-2 rounded-md overflow-x-auto">{selectedTestResult.curlCommand}</pre>
            <p><strong>Environment:</strong> {selectedTestResult.environment}</p>
            <p><strong>Branch:</strong> {selectedTestResult.branch}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiAutoTesting;
