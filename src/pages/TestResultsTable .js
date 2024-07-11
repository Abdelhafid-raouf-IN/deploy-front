import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import * as XLSX from 'xlsx';

const getMethodClass = (method) => {
  switch (method) {
    case 'GET':
      return 'bg-green-300 text-white'; 
    case 'POST':
      return 'bg-yellow-300 text-gray-900'; 
    case 'PUT':
      return 'bg-blue-300 text-white'; 
    case 'PATCH':
      return 'bg-purple-300 text-white'; 
    case 'DELETE':
      return 'bg-orange-300 text-white'; 
    case 'OPTIONS':
      return 'bg-pink-300 text-white'; 
    default:
      return 'bg-gray-200 text-gray-900'; 
  }
};

const getStatusClass = (status) => {
  if (status >= 200 && status < 300) {
    return 'text-green-500'; 
  } else {
    return 'text-red-500'; 
  }
};

const TestResultsTable = () => {
  const [testResults, setTestResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All'); // Nouvelle variable d'état pour le filtre de succès/échec

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/tests/results');
        setTestResults(response.data);
        setFilteredResults(response.data);
      } catch (error) {
        console.error('Error fetching test results:', error);
      }
    };

    fetchTestResults();
  }, []);

  useEffect(() => {
    let results = testResults.filter((result) =>
      result.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.status.toString().includes(searchTerm) ||
      result.startTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.stopTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.localDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.environment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus === 'Passed') {
      results = results.filter((result) => result.status >= 200 && result.status < 300);
    } else if (filterStatus === 'Failed') {
      results = results.filter((result) => result.status < 200 || result.status >= 300);
    }

    setFilteredResults(results);
  }, [searchTerm, testResults, filterStatus]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredResults, {
      header: ['apiName', 'endpoint', 'method', 'status', 'startTime', 'stopTime', 'duration', 'localDate', 'environment', 'branch'],
      columns: [
        { header: 'API Name', key: 'apiName' },
        { header: 'Endpoint', key: 'endpoint' },
        { header: 'Method', key: 'method' },
        { header: 'Status', key: 'status' },
        { header: 'Start Time', key: 'startTime' },
        { header: 'Stop Time', key: 'stopTime' },
        { header: 'Duration (ms)', key: 'duration' },
        { header: 'Local Date', key: 'localDate' },
        { header: 'Environment', key: 'environment' },
        { header: 'Branch', key: 'branch' },
      ],
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Test Results');
    XLSX.writeFile(wb, 'test_results.xlsx');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-screen-xl h-full overflow-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-1/3"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-1/3"
            >
              <option value="All">All</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
            </select>
            <img
              src="/images/excel-logo.png" 
              alt="Export to Excel"
              onClick={exportToExcel}
              className="w-10 h-10 cursor-pointer ml-2"
            />
          </div>
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Name</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Time</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (ms)</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local Date</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environment</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">{result.apiName}</td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">{result.endpoint}</td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold ${getMethodClass(result.method)} rounded-md`}>
                      {result.method}
                    </span>
                  </td>
                  <td className={`px-2 py-2 text-sm ${getStatusClass(result.status)} truncate flex items-center`}>
                    {result.status >= 200 && result.status < 300 ? (
                      <CheckCircleIcon className="w-5 h-5 mr-1" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 mr-1" />
                    )}
                    {result.status}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">{result.startTime}</td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">{result.stopTime}</td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">{result.duration} ms</td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">{result.localDate}</td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">{result.environment}</td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">{result.branch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestResultsTable;
