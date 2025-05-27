import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const StatisticsChart = ({ data, type, title }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: type === 'line' ? {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    } : undefined
  };

  if (type === 'bar') {
    return <div style={{ height: '400px' }}><Bar options={options} data={data} /></div>;
  } else if (type === 'pie') {
    return <div style={{ height: '400px' }}><Pie data={data} options={options} /></div>;
  } else if (type === 'line') {
    return <div style={{ height: '400px' }}><Line options={options} data={data} /></div>;
  }

  return null;
};

export default StatisticsChart; 