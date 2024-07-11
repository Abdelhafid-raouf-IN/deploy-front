import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CheckApi = () => {
  const [apiStatuses, setApiStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 24;
  const [startIndex, setStartIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(true);
  const [showPrevButton, setShowPrevButton] = useState(false);

  const [availableApis, setAvailableApis] = useState(0);
  const [unavailableApis, setUnavailableApis] = useState(0);

  // States for form and modal
  const [showModal, setShowModal] = useState(false);
  const [newApiName, setNewApiName] = useState('');
  const [newApiUrl, setNewApiUrl] = useState('');
  const [newApiEnvironment, setNewApiEnvironment] = useState('');

  useEffect(() => {
    const fetchApiEndpoints = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/endpoints'); // Replace with your backend API endpoint
        const endpoints = response.data;
        const statuses = await Promise.all(endpoints.map(async (endpoint) => {
          const status = await checkApiStatus(endpoint.url);
          return { ...endpoint, status };
        }));

        const groupedStatuses = statuses.reduce((acc, curr) => {
          if (!acc[curr.name]) {
            acc[curr.name] = { name: curr.name, environments: [] };
          }
          acc[curr.name].environments.push({ status: curr.status, environment: curr.environment, url: curr.url });
          return acc;
        }, {});

        setApiStatuses(Object.values(groupedStatuses));
        setAvailableApis(statuses.filter(api => api.status).length);
        setUnavailableApis(statuses.filter(api => !api.status).length);
      } catch (error) {
        console.error('Error fetching API endpoints:', error);
      }
    };

    fetchApiEndpoints();
  }, []);

  useEffect(() => {
    const filteredStatuses = apiStatuses.filter(
      api =>
        api.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setCurrentPage(1);
    setStartIndex(0);
    setShowPrevButton(false);
    setShowNextButton(filteredStatuses.length > itemsPerPage);
  }, [searchQuery, apiStatuses, itemsPerPage]);

  const checkApiStatus = async (apiUrl) => {
    try {
      const response = await fetch(apiUrl);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleNextClick = () => {
    const newStartIndex = startIndex + itemsPerPage;
    setStartIndex(newStartIndex);
    setCurrentPage(currentPage + 1);
    setShowPrevButton(true);

    if (newStartIndex + itemsPerPage >= apiStatuses.length) {
      setShowNextButton(false);
    }
  };

  const handlePrevClick = () => {
    const newStartIndex = startIndex - itemsPerPage;
    setStartIndex(newStartIndex);
    setCurrentPage(currentPage - 1);
    setShowNextButton(true);

    if (newStartIndex === 0) {
      setShowPrevButton(false);
    }
  };

  const handleAddApi = async () => {
    try {
      const newApi = {
        name: newApiName,
        url: newApiUrl,
        environment: newApiEnvironment
      };
      // Call your backend API to add the new API endpoint
      await axios.post('http://localhost:9090/api/endpoints/create', newApi); // Replace with your backend API endpoint

      // Fetch the updated list of API endpoints
      const response = await axios.get('http://localhost:9090/api/endpoints'); // Replace with your backend API endpoint
      const endpoints = response.data;
      const statuses = await Promise.all(endpoints.map(async (endpoint) => {
        const status = await checkApiStatus(endpoint.url);
        return { ...endpoint, status };
      }));

      const groupedStatuses = statuses.reduce((acc, curr) => {
        if (!acc[curr.name]) {
          acc[curr.name] = { name: curr.name, environments: [] };
        }
        acc[curr.name].environments.push({ status: curr.status, environment: curr.environment, url: curr.url });
        return acc;
      }, {});

      setApiStatuses(Object.values(groupedStatuses));
      setAvailableApis(statuses.filter(api => api.status).length);
      setUnavailableApis(statuses.filter(api => !api.status).length);

      // Reset form fields and close modal
      setNewApiName('');
      setNewApiUrl('');
      setNewApiEnvironment('');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding API endpoint:', error);
    }
  };

  const paginatedStatuses = apiStatuses
    .filter(api =>
      api.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-3">
      <div className="mb-4 text-white p-6 rounded-lg shadow-lg text-center border border-blue-700" style={{ background: '#280257', background: 'linear-gradient(180deg, #280257, #140131)' }}>
        <div className="flex items-center justify-center mb-4">
          <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18M7 12h2v6H7zM15 8h2v10h-2zM11 16h2v2h-2zM19 4h2v14h-2z" />
          </svg>
          <h2 className="text-3xl font-bold">Statistics</h2>
        </div>
        <p className="text-lg mb-2 flex items-center justify-center">
          APIs Disponibles: {availableApis}
          <span className="ml-2 inline-flex items-center justify-center w-3 h-3 bg-green-500 rounded-full" title="En ligne"></span>
        </p>
        <p className="text-lg flex items-center justify-center">
          APIs Indisponibles: {unavailableApis}
          <span className="ml-2 inline-flex items-center justify-center w-3 h-3 bg-red-500 rounded-full" title="Hors ligne"></span>
        </p>
      </div>
      <div className="flex flex-wrap -mx-4 mb-4">
        {paginatedStatuses.map((api, index) => (
          <div className="w-full md:w-1/4 lg:w-1/4 px-4 mb-4" key={index}>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <p className="text-lg font-semibold text-gray-900 mb-2 truncate" title={api.name}>
                {api.name}
              </p>
              {api.environments.map((env, envIndex) => (
                <div key={envIndex} className="mb-2">
                  <a
                    href={env.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${env.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    title={env.url}
                  >
                    <span className={`w-2 h-2 ${env.status ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-1`}></span>
                    {env.status ? `Available in ${env.environment}` : `Unavailable in ${env.environment}`}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="w-full md:w-1/4 lg:w-1/4 px-4 mb-4 flex justify-center items-center">
          <svg className="h-8 w-8 text-blue-500 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" onClick={() => setShowModal(true)}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        {showPrevButton && (
          <svg
            onClick={handlePrevClick}
            className="h-10 w-10 text-gray-600 cursor-pointer hover:text-gray-400 dark:hover:text-gray-300"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="5" y1="12" x2="11" y2="18" />
            <line x1="5" y1="12" x2="11" y2="6" />
          </svg>
        )}
        {showNextButton && (
          <svg
            onClick={handleNextClick}
            className="h-10 w-10 text-gray-600 cursor-pointer hover:text-blue-700 dark:hover:text-blue-400"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="13" y1="18" x2="19" y2="12" />
            <line x1="13" y1="6" x2="19" y2="12" />
          </svg>
        )}
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
  <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>

    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

    <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="flex flex-col items-center">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            Ajouter une nouvelle API
          </h3>
          <div className="mt-4 w-full">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="api-name">
                Nom de l'API
              </label>
              <input
                type="text"
                id="api-name"
                value={newApiName}
                onChange={(e) => setNewApiName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="api-url">
                URL de L'environnement de l'API
              </label>
              <input
                type="text"
                id="api-url"
                value={newApiUrl}
                onChange={(e) => setNewApiUrl(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="api-environment">
                Environnement de l'API
              </label>
              <input
                type="text"
                id="api-environment"
                value={newApiEnvironment}
                onChange={(e) => setNewApiEnvironment(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={handleAddApi}
        >
          Ajouter
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={() => setShowModal(false)}
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</div>     
      )}
    </div>
  );
};

export default CheckApi;
