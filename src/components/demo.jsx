import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  annotationPlugin
);

const SPXZoneChart = ({ spxPrice }) => {
  // Boundaries
  const outsideLowEnd = 5785;
  const partiallyInsideLowEnd = 5787.85;
  const insideLowEnd = 5790;
  const insideHighEnd = 5890;
  const partiallyInsideHighStart = 5892.15;
  const outsideHighStart = 5895;

  // Axis min/max with ±30 buffer
  const xMin = outsideLowEnd - 30;     // 5755
  const xMax = outsideHighStart + 30;  // 5925

  // Define segments with exact width and color
  const segments = [
    {
      label: 'Outside Low',
      from: xMin,
      to: outsideLowEnd,
      color: '#ff0000',
    },
    {
      label: 'Partially Inside Low',
      from: outsideLowEnd,
      to: partiallyInsideLowEnd,
      color: '#ffff00',
    },
    {
      label: 'Partially Outside Low',
      from: partiallyInsideLowEnd,
      to: insideLowEnd,
      color: '#ffff00',
    },
    {
      label: 'Inside',
      from: insideLowEnd,
      to: insideHighEnd,
      color: '#00cc00',
    },
    {
      label: 'Partially Outside High',
      from: insideHighEnd,
      to: partiallyInsideHighStart,
      color: '#ffff00',
    },
    {
      label: 'Partially Inside High',
      from: partiallyInsideHighStart,
      to: outsideHighStart,
      color: '#ffff00',
    },
    {
      label: 'Outside High',
      from: outsideHighStart,
      to: xMax,
      color: '#ff0000',
    }
  ];

  // Convert segments into datasets for stacked bars
  const datasets = segments.map(segment => ({
    label: segment.label,
    data: [segment.to - segment.from],
    backgroundColor: segment.color,
    borderWidth: 1,
    borderColor: segment.color,
  }));

  const data = {
    labels: ['SPX Zone'],
    datasets: datasets,
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        min: xMin,
        max: xMax,
        ticks: {
          stepSize: 10,
          color: '#333',
          font: { size: 12 },
        },
        grid: {
          drawBorder: true,
          color: '#ccc',
        },
      },
      y: {
        stacked: true,
        display: false,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: { size: 12 },
        },
      },
      annotation: {
        annotations: {
          arrow: {
            type: 'point',
            xValue: spxPrice,
            yValue: 0,
            backgroundColor: '#000',
            pointStyle: 'triangle',
            radius: 8,
            rotation: 180,
            yAdjust: 20,
            borderWidth: 1,
            borderColor: '#000',
          },
          label: {
            type: 'label',
            xValue: spxPrice,
            yValue: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            content: [`SPX: ${spxPrice}`],
            font: {
              size: 12,
              weight: 'bold',
            },
            color: '#000',
            yAdjust: -10,
            padding: 6,
            borderRadius: 4,
            borderColor: '#000',
            borderWidth: 1,
          },
          line: {
            type: 'line',
            xMin: spxPrice,
            xMax: spxPrice,
            borderColor: '#000',
            borderWidth: 2,
            borderDash: [6, 6],
          },
        },
      },
    },
  };

  return (
    <div style={{ height: 150, width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SPXZoneChart;
