// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get('http://localhost:9090/actuator/health');
        setHealthData(response.data);
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    const fetchMetricsData = async () => {
      try {
        const response = await axios.get('http://localhost:9090/actuator/metrics');
        setMetricsData(response.data);
      } catch (error) {
        console.error('Error fetching metrics data:', error);
      }
    };

    fetchHealthData();
    fetchMetricsData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Actuator Dashboard</h1>
      <div className="health">
        <h2>Health</h2>
        {healthData ? (
          <pre>{JSON.stringify(healthData, null, 2)}</pre>
        ) : (
          <p>Loading health data...</p>
        )}
      </div>
      <div className="metrics">
        <h2>Metrics</h2>
        {metricsData ? (
          <pre>{JSON.stringify(metricsData, null, 2)}</pre>
        ) : (
          <p>Loading metrics data...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
