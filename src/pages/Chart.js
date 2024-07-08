import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function HealthStatus() {
  const [healthData, setHealthData] = useState(null);
  const [chartData, setChartData] = useState({
    labels: ['Total Space (GB)', 'Free Space (GB)', 'Used Space (GB)'],
    datasets: [{
      label: 'Disk Space',
      data: [0, 0, 0],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  });

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get('http://localhost:9090/actuator/health');
        const data = response.data;
        setHealthData(data);

        const diskSpaceDetails = data.components.diskSpace?.details || {};
        const totalSpaceBytes = diskSpaceDetails.total || 0;
        const freeSpaceBytes = diskSpaceDetails.free || 0;
        const usedSpaceBytes = totalSpaceBytes - freeSpaceBytes;

        const bytesToGigabytes = (bytes) => (bytes / (1024 * 1024 * 1024)).toFixed(2);

        const totalSpaceGB = bytesToGigabytes(totalSpaceBytes);
        const freeSpaceGB = bytesToGigabytes(freeSpaceBytes);
        const usedSpaceGB = bytesToGigabytes(usedSpaceBytes);

        setChartData({
          labels: ['Total Space (GB)', 'Free Space (GB)', 'Used Space (GB)'],
          datasets: [{
            label: 'Disk Space',
            data: [totalSpaceGB, freeSpaceGB, usedSpaceGB],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        });
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    // Initial fetch
    fetchHealthData();

    // Set up polling every 10 seconds
    const intervalId = setInterval(fetchHealthData, 10000);  // 10000 ms = 10 seconds

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (!healthData) return <p className="text-center text-gray-500">Loading...</p>;

  const data = chartData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} GB`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Space'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount (GB)'
        }
      }
    },
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col p-4">
      <div className="flex-grow bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Health Status</h2>
          <p className="text-lg mb-4">Status: 
            <span className={`font-semibold ${healthData.status === 'UP' ? 'text-green-600' : 'text-red-600'}`}>
              {healthData.status}
            </span>
          </p>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            <ul className="space-y-4 mb-6">
              {Object.keys(healthData.components).map(componentKey => (
                <li key={componentKey} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-lg mb-2 text-gray-900">{componentKey}</h4>
                  <p className={`text-base mb-2 ${healthData.components[componentKey].status === 'UP' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {healthData.components[componentKey].status}
                  </p>
                  {healthData.components[componentKey].details && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {Object.entries(healthData.components[componentKey].details).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value.toString()}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <div className="flex justify-center h-96">
              <Line data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthStatus;
