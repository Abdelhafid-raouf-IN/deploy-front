import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SwaggerClient from 'swagger-client';
import '../style/styles.css';

const ApiTestForm = ({ selectedApiData, testPassNotification, testFailNotification }) => {
  const [apis, setApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState('');
  const [endpoints, setEndpoints] = useState({});
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [baseApiUrl, setBaseApiUrl] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('');
  const [body, setBody] = useState('');
  const [token, setToken] = useState('');
  const [environment, setEnvironment] = useState('-');
  const [branch, setBranch] = useState('-');
  const [parameters, setParameters] = useState([]);
  const [paramValues, setParamValues] = useState({});
  const [responseResult, setResponseResult] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);
  const [curlCommand, setCurlCommand] = useState('');
  const [status, setstatus] = useState([]);

  useEffect(() => {
    const loadApis = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/auth/apis'); // Assurez-vous de remplacer avec l'URL correcte de votre backend
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

  useEffect(() => {
    if (selectedEndpoint && selectedMethod) {
      const endpoint = endpoints[selectedEndpoint];
      if (endpoint) {
        const methodDetails = endpoint[selectedMethod];
        if (methodDetails) {
          setUrl(`${baseApiUrl}${selectedEndpoint}`);
          setMethod(selectedMethod.toUpperCase());
          setParameters(methodDetails.parameters || []);
          setBody(
            methodDetails.requestBody && methodDetails.requestBody.content["application/json"]
              ? JSON.stringify(methodDetails.requestBody.content["application/json"].example, null, 2)
              : ''
          );
        }
      }
    }
  }, [selectedEndpoint, selectedMethod, endpoints, baseApiUrl]);

  useEffect(() => {
    if (selectedApiData) {
      setSelectedApi(selectedApiData.apiName);
      setSelectedEndpoint(selectedApiData.endpoint);
      setSelectedMethod(selectedApiData.method);
    }
  }, [selectedApiData]);

  const handleParamChange = (paramName, value) => {
    setParamValues({
      ...paramValues,
      [paramName]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const queryString = Object.keys(paramValues)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramValues[key])}`)
        .join('&');
      const fullUrl = `${url}?${queryString}`;

      const options = {
        method,
        url: fullUrl,
        data: body ? JSON.parse(body) : {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        validateStatus: function (status) {
          return status < 500;
        },
      };
      const response = await axios(options);

      const testResult = {
        apiName: selectedApi,
        endpoint: selectedEndpoint,
        method: selectedMethod,
        status: response.status,
        responseBody: JSON.stringify(response.data),
        responseHeaders: JSON.stringify(response.headers),
      };
      console.log('Sending test result:', testResult); // Vérification dans la console du navigateur

      await axios.post('http://localhost:9090/api/auth/save', testResult);
      setstatus(response.status);
      setResponseResult(response.data);
      setResponseHeaders(response.headers);
      const curlCmd = `curl -X ${method} ${fullUrl} -H 'Authorization: Bearer ${token}'`;
      setCurlCommand(curlCmd);

      testPassNotification();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        testFailNotification();
      } else {
        console.error('Error during API call:', error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">API Test Form</h2>
          <span className="text-sm font-medium text-gray-600">Testeur d'API</span>
        </div>

        <form onSubmit={handleSubmit} id="apiForm">
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
                <label htmlFor="endpoint" className="block text-sm font-medium text-gray-900 mb-1">Select Endpoint</label>
                <select
                  id="endpoint"
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
                >
                  <option value="">Select an endpoint</option>
                  {Object.keys(endpoints).map((endpoint) => (
                    <option key={endpoint} value={endpoint}>{endpoint}</option>
                  ))}
                </select>
              </div>

              {selectedEndpoint && (
                <div className="mb-4">
                  <label htmlFor="method" className="block text-sm font-medium text-gray-900 mb-1">Select Method</label>
                  <select
                    id="method"
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
                  >
                    <option value="">Select a method</option>
                    {Object.keys(endpoints[selectedEndpoint]).map((method) => (
                      <option key={method} value={method}>{method.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              )}
              {selectedMethod && (
                <>
                  <div className="mb-4">
                    <label htmlFor="url" className="block text-sm font-medium text-gray-900 mb-1">URL</label>
                    <input
                      type="text"
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
                      required
                    />
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="method" className="block text-sm font-medium text-gray-900 mb-1">Method</label>
                      <input
                        type="text"
                        id="method"
                        value={method}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
                      />
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
                      <label htmlFor="body" className="block text-sm font-medium text-gray-900 mb-1">Request Body (JSON)</label>
                      <textarea
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 h-24 resize-none"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="environment" className="block text-sm font-medium text-gray-900 mb-1">Environment</label>
              <select
                id="environment"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
              >
                <option value="-">-</option>
                <option value="DEV">DEV</option>
                <option value="HF">HF</option>
                <option value="HT">HT</option>
              </select>
            </div>
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-900 mb-1">Branch</label>
              <select
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600"
              >
                <option value="-">-</option>
                <option value="BF">BF-BURKINA FASO (SGBF)</option>
                <option value="BJ">BJ-BENIN (SGB)</option>
                <option value="CG">CG-CONGO (SGC)</option>
                <option value="CM">CM-CAMEROON (SGCAM)</option>
                <option value="GH">GH-GHANA (SGGH)</option>
                <option value="GN">GN-GUINEE (SGBG)</option>
                <option value="MG">MG-MADAGASCAR (BFVSG)</option>
                <option value="MR">MR-MAURITANIE (SGM)</option>
                <option value="SN">SN-SENEGAL (SGBS)</option>
                <option value="TD">TD-TCHAD (SGT)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => { setUrl(''); setMethod(''); setBody(''); setToken(''); setResponseResult(null); }}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 ml-4 text-sm font-semibold text-white bg-green-700 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Test API
            </button>
          </div>
        </form>

        {responseResult && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">API Response:</h3>
            
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-1">Status code:</h4>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto max-h-64">
                {status}
              </pre>
            </div>
            
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-1">Response Headers:</h4>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto max-h-64">
                {responseHeaders && JSON.stringify(responseHeaders, null, 2)}
              </pre>
            </div>
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-1">Response Body:</h4>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto max-h-64">
                {JSON.stringify(responseResult, null, 2)}
              </pre>
            </div>
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-1">Curl Command:</h4>
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto max-h-64">
                {curlCommand}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTestForm;
