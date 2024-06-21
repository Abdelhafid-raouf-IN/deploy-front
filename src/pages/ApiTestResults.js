import React from 'react';

const ApiTestResults = ({ results }) => {
  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Résultats de l'API</h2>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
};

export default ApiTestResults;
