import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const CheckApi = () => {
  const [apiStatuses, setApiStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 24;
  const [startIndex, setStartIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(true);
  const [showPrevButton, setShowPrevButton] = useState(false);

  const [totalApis, setTotalApis] = useState(0);
  const [availableApis, setAvailableApis] = useState(0);
  const [unavailableApis, setUnavailableApis] = useState(0);

  useEffect(() => {
    const fetchApiEndpoints = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/auth/endpoints'); // Replace with your backend API endpoint
        const endpoints = response.data;
        const statuses = await Promise.all(endpoints.map(async (endpoint) => {
          const status = await checkApiStatus(endpoint.url);
          return { ...endpoint, status };
        }));
        setApiStatuses(statuses);

        // Update global statistics
        setTotalApis(statuses.length);
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
        api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.url.toLowerCase().includes(searchQuery.toLowerCase())
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

  const paginatedStatuses = apiStatuses
    .filter(api =>
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.url.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-3">
      <div className="mb-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 rounded-lg shadow-lg text-center border border-blue-700">
        <div className="flex items-center justify-center mb-4">
        <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18M7 12h2v6H7zM15 8h2v10h-2zM11 16h2v2h-2zM19 4h2v14h-2z" />
        </svg>
          <h2 className="text-3xl font-bold">statistics</h2>
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
              <p className="text-lg font-semibold text-gray-900 mb-2 truncate">{api.name}</p>
              <p className="text-sm text-gray-500 truncate">{api.url}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${api.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <span className={`w-2 h-2 ${api.status ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-1`}></span>
                {api.status ? `Available in ${api.environment}` : `Unavailable in ${api.environment}`}
              </span>
            </div>
          </div>
        ))}
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
    </div>
  );
};

export default CheckApi;
