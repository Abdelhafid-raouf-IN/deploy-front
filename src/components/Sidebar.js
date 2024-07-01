// Sidebar.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import SwaggerClient from 'swagger-client';

const Side = styled.div`
  select {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    background: #2d176e;
    color: #fff;
    border: none;
    border-radius: 10px;
    outline: none;

    option {
      background: #2d176e;
      color: #fff;
    }
  }

  background: #FFFFFF;
  height: 100vh;
  position: fixed;
  top: 100;
  left: 100;
  padding: 20px;
  color: #000000;

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.5rem;
    border-bottom: 1px solid #E5E7EB;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .header-title {
    color: #4B5563; /* Gray-600 text color */
  }

  .menu-title {
    margin: 1rem 0;
    color: #9CA3AF; /* Gray-400 text color */
    font-weight: 300;
    font-size: 0.875rem;
    text-transform: uppercase;
  }

  a {
    display: flex;
    align-items: center;
    height: 2.75rem;
    padding: 0 1.5rem;
    border-left: 4px solid transparent;
    color: #4B5563; /* Gray-600 text color */
    text-decoration: none;
    margin-bottom: 0.5rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s;

    &:hover {
      background-color: #F3F4F6; /* Gray-50 background color */
      color: #1F2937; /* Gray-800 text color */
      border-left-color: #6366F1; /* Indigo-500 border color */
    }

    .icon {
      margin-left: 0.5rem;
      color: #6B7280; /* Gray-500 text color */
    }

    .text {
      margin-left: 0.5rem;
      font-size: 0.875rem;
      font-weight: 400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .badge {
      margin-left: auto;
      padding: 0 0.5rem;
      height: 1.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #F3F4F6; /* Gray-50 background color */
    }

    .badge.new {
      color: #4F46E5; /* Indigo-500 text color */
      background-color: #E0E7FF; /* Indigo-100 background color */
    }

    .badge.notification {
      color: #DC2626; /* Red-600 text color */
      background-color: #FEE2E2; /* Red-100 background color */
    }

    .badge.clients {
      color: #10B981; /* Green-500 text color */
      background-color: #D1FAE5; /* Green-100 background color */
    }
  }

  .endpoint {
    padding: 0.5rem 1rem;
    background: #F3F4F6; /* Gray-50 background color */
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    
    .label {
      font-weight: 500;
      margin-right: 0.5rem;
      min-width: 50px; /* Ajustez cette valeur selon vos besoins pour aligner correctement les labels */
    }

    .get-label {
      color: #10B981; /* Green-500 text color */
    }

    .post-label {
      color: #F59E0B; /* Yellow-500 text color */
    }

    .put-label {
      color: #3B82F6; /* Blue-500 text color */
    }

    .patch-label {
      color: #8B5CF6; /* Violet-500 text color */
    }

    .delete-label {
      color: #F97316; /* Orange-500 text color */
    }

    .options-label {
      color: #EC4899; /* Pink-500 text color */
    }
  }

  .api-group {
    margin-bottom: 1.5rem;
  }

  .api-header {
    font-size: 1rem;
    cursor: pointer;
    margin-bottom: 0.5rem;
    padding: 0.75rem;
    background: #F3F4F6; /* Gray-50 background color */
    border-radius: 0.375rem;
    font-weight: 500;
    color: #1F2937; /* Gray-800 text color */
  }
`;
const Sidebar = () => {
  const [apis, setApis] = useState([]);
  const [openApi, setOpenApi] = useState(null);

  useEffect(() => {
    const loadApis = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/auth/apis'); // Remplacez avec l'URL correcte de votre backend
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

  const toggleApi = (apiName) => {
    setOpenApi(openApi === apiName ? null : apiName);
  };

  return (
    <Side>
      {apis.map((api) => (
        <div className="api-group" key={api.name}>
          <div className="api-header" onClick={() => toggleApi(api.name)}>
            {api.name}
          </div>
          {openApi === api.name && (
            <div className="endpoints">
              {Object.keys(api.client.spec.paths).map((endpoint) =>
                Object.keys(api.client.spec.paths[endpoint]).map((method) => (
                  <div className="endpoint" key={`${endpoint}-${method}`}>
                    {method === 'get' && <span className="label get-label">GET</span>}
                    {method === 'post' && <span className="label post-label">POST</span>}
                    {method === 'put' && <span className="label put-label">PUT</span>}
                    {method === 'patch' && <span className="label patch-label">PATCH</span>}
                    {method === 'delete' && <span className="label delete-label">DELETE</span>}
                    {method === 'options' && <span className="label options-label">OPTIONS</span>}
                    <span>{endpoint}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </Side>
  );
};

export default Sidebar;
