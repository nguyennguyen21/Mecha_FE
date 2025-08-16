import React from 'react';
import { Bar } from 'react-chartjs-2';

// Import required Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const data = {
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        label: 'Revenue',
        data: [100, 200, 500],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Re',
        data: [10, 20, 50],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
  <div style={{ width: 'full', height: 'auto', margin: '0 auto' }}>
  <Bar data={data} options={options} />
  </div>
  )
};

export default Chart;