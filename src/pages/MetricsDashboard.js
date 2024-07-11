import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const namesResponse = await axios.get('http://localhost:9090/actuator/metrics');
        const metricNames = namesResponse.data.names;

        const metricsPromises = metricNames.map(name => axios.get(`http://localhost:9090/actuator/metrics/${name}`));
        const metricsResponses = await Promise.all(metricsPromises);

        const metricsData = metricsResponses.reduce((acc, { data }) => {
          acc[data.name] = data.measurements;
          return acc;
        }, {});

        setMetrics(metricsData);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 10); // Fetch every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const diskFree = metrics['disk.free']?.[0]?.value || 0;
  const diskTotal = metrics['disk.total']?.[0]?.value || 0;
  const jvmThreadsLive = metrics['jvm.threads.live']?.[0]?.value || 0;
  const jvmThreadsDaemon = metrics['jvm.threads.daemon']?.[0]?.value || 0;
  const jvmThreadsPeak = metrics['jvm.threads.peak']?.[0]?.value || 0;
  const processCpuTime = metrics['process.cpu.time']?.[0]?.value || 0;
  const cpuUsage = metrics['system.cpu.usage']?.[0]?.value || 0;

  // Couleurs pour les graphiques spécifiques
  const colors = {
    diskUsage: { backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)' },
    jvmThreads: { backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgba(255, 99, 132, 1)' },
    cpuTime: { backgroundColor: 'rgba(255, 159, 64, 0.2)', borderColor: 'rgba(255, 159, 64, 1)' },
    cpuUsage: { backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgba(255, 99, 132, 1)' },
    default: { backgroundColor: 'rgba(128, 0, 128, 0.2)', borderColor: 'rgba(128, 0, 128, 1)' } // Couleur violette par défaut
};

  const generateChartData = (metricName, metricData) => {
    let backgroundColor = colors.default.backgroundColor;
    let borderColor = colors.default.borderColor;

    switch (metricName) {
      case 'executor.active':
        backgroundColor = colors.default.backgroundColor;
        borderColor = colors.default.borderColor;
        break;
      case 'executor.completed':
        backgroundColor = 'rgba(153, 102, 255, 0.2)';
        borderColor = 'rgba(153, 102, 255, 1)';
        break;
      case 'executor.pool.core':
        backgroundColor = 'rgba(255, 159, 64, 0.2)';
        borderColor = 'rgba(255, 159, 64, 1)';
        break;
      case 'executor.pool.max':
        backgroundColor = 'rgba(255, 99, 132, 0.2)';
        borderColor = 'rgba(255, 99, 132, 1)';
        break;
      case 'executor.pool.size':
        backgroundColor = 'rgba(54, 162, 235, 0.2)';
        borderColor = 'rgba(54, 162, 235, 1)';
        break;
      case 'executor.queue.remaining':
        backgroundColor = 'rgba(255, 206, 86, 0.2)';
        borderColor = 'rgba(255, 206, 86, 1)';
        break;
      case 'executor.queued':
        backgroundColor = 'rgba(75, 192, 192, 0.2)';
        borderColor = 'rgba(75, 192, 192, 1)';
        break;
      case 'hikaricp.connections':
        backgroundColor = 'rgba(153, 102, 255, 0.2)';
        borderColor = 'rgba(153, 102, 255, 1)';
        break;
      case 'hikaricp.connections.acquire':
        backgroundColor = 'rgba(255, 159, 64, 0.2)';
        borderColor = 'rgba(255, 159, 64, 1)';
        break;
      case 'http.server.requests':
        backgroundColor = 'rgba(255, 99, 132, 0.2)';
        borderColor = 'rgba(255, 99, 132, 1)';
        break;
      default:
        break;
    }

    return {
      labels: metricData.map((_, index) => `${metricName} ${index + 1}`),
      datasets: [
        {
          label: metricName,
          data: metricData.map(data => data.value),
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    };
  };

  const dataDiskUsage = {
    labels: ['Free Disk Space', 'Used Disk Space'],
    datasets: [
      {
        label: 'Disk Usage (GB)',
        data: [diskFree / 1_000_000_000, (diskTotal - diskFree) / 1_000_000_000],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const dataJvmThreads = {
    labels: ['Live Threads', 'Daemon Threads', 'Peak Threads'],
    datasets: [
      {
        label: 'JVM Threads',
        data: [jvmThreadsLive, jvmThreadsDaemon, jvmThreadsPeak],
        backgroundColor: ['rgba(255, 206, 86, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(255, 206, 86, 1)', 'rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const dataCpuTime = {
    labels: ['CPU Time'],
    datasets: [
      {
        label: 'CPU Time (ms)',
        data: [processCpuTime],
        backgroundColor: colors.cpuTime.backgroundColor,
        borderColor: colors.cpuTime.borderColor,
        borderWidth: 1,
      },
    ],
  };

  const dataCpuUsage = {
    labels: ['CPU Usage'],
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: [cpuUsage * 100],
        backgroundColor: colors.cpuUsage.backgroundColor,
        borderColor: colors.cpuUsage.borderColor,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Metrics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-white border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Disk Usage</h2>
          <Doughnut data={dataDiskUsage} />
          <div className="mt-4 text-center">
            <span className="text-lg font-medium">Free Disk Space: {(diskFree / 1_000_000_000).toFixed(2)} GB</span>
            <span className="text-lg font-medium">Used Disk Space: {((diskTotal - diskFree) / 1_000_000_000).toFixed(2)} GB</span>
          </div>
        </div>

        <div className="p-4 bg-white border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">JVM Threads</h2>
          <Bar data={dataJvmThreads} />
          <div className="mt-4 text-center">
            <span className="text-lg font-medium">Live Threads: {jvmThreadsLive}</span>
            <span className="text-lg font-medium">Daemon Threads: {jvmThreadsDaemon}</span>
            <span className="text-lg font-medium">Peak Threads: {jvmThreadsPeak}</span>
          </div>
        </div>

        <div className="p-4 bg-white border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">CPU Time</h2>
          <Bar data={dataCpuTime} />
          <div className="mt-4 text-center">
            <span className="text-lg font-medium">CPU Time: {processCpuTime} ms</span>
          </div>
        </div>

        <div className="p-4 bg-white border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">CPU Usage</h2>
          <Bar data={dataCpuUsage} />
          <div className="mt-4 text-center">
            <span className="text-lg font-medium">CPU Usage: {(cpuUsage * 100).toFixed(2)}%</span>
          </div>
        </div>

        {Object.entries(metrics).map(([metricName, metricData]) => {
          if (['disk.free', 'disk.total', 'jvm.threads.live', 'jvm.threads.daemon', 'jvm.threads.peak', 'process.cpu.time', 'system.cpu.usage'].includes(metricName)) {
            return null; // Skip already handled metrics
          }
          return (
            <div key={metricName} className="p-4 bg-white border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">{metricName.replace(/\./g, ' ')}</h2>
              <Bar data={generateChartData(metricName, metricData)} />
              <div className="mt-4 text-center">
                {metricData.map((data, index) => (
                  <span key={index} className="text-lg font-medium">
                    {`${metricName.replace(/\./g, ' ')} ${index + 1}: ${data.value}`}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsDashboard;
