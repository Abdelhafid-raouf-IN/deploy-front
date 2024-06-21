import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { TransitionGroup, CSSTransition } from 'react-transition-group'; // Importer TransitionGroup et CSSTransition depuis react-transition-group
const CheckApi = () => {
  const apiEndpoints = [
    {
      name: 'API 1',
      url: 'https://fakestoreapi.com',
      environment: 'Production'
    },
    {
      name: 'API 2',
      url: 'https://fakestoreapi.dev',
      environment: 'Dev'
    },
    {
      name: 'API 3',
      url: 'https://fakestoreapi.com',
      environment: 'Production'
    },
    {
      name: 'API 4',
      url: 'https://fakestoreapi.com',
      environment: 'Dev'
    },
    {
      name: 'API 5',
      url: 'https://fakestoreapi.co',
      environment: 'Production'
    },
    {
      name: 'API 6',
      url: 'https://fakestoreapi.dev',
      environment: 'Dev'
    },
    {
      name: 'API 7',
      url: 'https://fakestoreapi.com',
      environment: 'Production'
    },
    {
      name: 'API 8',
      url: 'https://fakestoreapi.dev',
      environment: 'Dev'
    },
    {
      name: 'API 9',
      url: 'https://fakestoreapi.com',
      environment: 'Production'
    },
    {
      name: 'API 10',
      url: 'https://fakestoreapi.com',
      environment: 'Dev'
    },
    {
      name: 'API 11',
      url: 'https://fakestoreapi.co',
      environment: 'Production'
    },
    {
      name: 'API 12',
      url: 'https://fakestoreapi.com',
      environment: 'Dev'
    },
    {
      name: 'API 13',
      url: 'https://fakestoreapi.com',
      environment: 'Production'
    },
    {
      name: 'API 14',
      url: 'https://fakestoreapi.dev',
      environment: 'Dev'
    },
    {
      name: 'API 15',
      url: 'https://fakestoreapi.com',
      environment: 'Production'
    },
    {
      name: 'API 16',
      url: 'https://fakestoreapi.dev',
      environment: 'Dev'
    },
    {
      name: 'API 17',
      url: 'https://fakestoreapi.com',
      environment: 'Production'
    },
    {
      name: 'API 18',
      url: 'https://fakestoreapi.dev',
      environment: 'Dev'
    },
    {
      name: 'API 19',
      url: 'https://fakestoreapi.com',
      environment: 'Production'
    },
    {
      name: 'API 20',
      url: 'https://fakestoreapi.com',
      environment: 'Dev'
    },
    {
      name: 'API 21',
      url: 'https://fakestoreapi.co',
      environment: 'Production'
    },
    {
      name: 'API 22',
      url: 'https://fakestoreapi.dev',
      environment: 'Dev'
    },
    {
      name: 'API 23',
      url: 'https://fakestoreapi.com',
      environment: 'Production'
    },
    {
      name: 'API 24',
      url: 'https://fakestoreapi.com',
      environment: 'Production'
    },
  

    // Ajoutez d'autres endpoints d'API selon vos besoins
  ];

  const [filter, setFilter] = useState('all');
  const [apiStatuses, setApiStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 24;
  const [startIndex, setStartIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(true);
  const [showPrevButton, setShowPrevButton] = useState(false);

  useEffect(() => { 
    const fetchData = async () => {
      const statuses = [];
      for (let api of apiEndpoints) {
        if (filter !== 'all' && api.environment.toLowerCase() !== filter.toLowerCase()) continue;

        const apiStatus = await checkApiStatus(api.url);
        statuses.push({ ...api, status: apiStatus });
      }
      setApiStatuses(statuses);
    };

    fetchData();
  }, [filter]);

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
  }, [filter, searchQuery, apiStatuses, itemsPerPage]);

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
      <div className="flex flex-wrap -mx-4 mb-4">
          {paginatedStatuses.map((api, index) => (
              <div className="w-full md:w-1/4 lg:w-1/4 px-4 mb-4">
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