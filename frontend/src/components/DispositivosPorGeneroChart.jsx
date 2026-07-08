import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useDispositivosPorGenero } from '../hooks/useDispositivosPorGenero';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const GENERO_ORDER = [
  'Ação',
  'Animação',
  'Comédia',
  'Documentário',
  'Drama',
  'Ficção Científica',
  'Romance',
  'Terror',
];

const DEVICE_ORDER = ['Computador/Notebook', 'Smartphone', 'Streaming Dongle', 'TV', 'Tablet'];

const DEVICE_COLORS = {
  TV: { bg: 'rgba(236, 72, 153, 0.72)', border: 'rgb(236, 72, 153)' },
  Smartphone: { bg: 'rgba(59, 130, 246, 0.72)', border: 'rgb(59, 130, 246)' },
  'Computador/Notebook': { bg: 'rgba(20, 184, 166, 0.72)', border: 'rgb(20, 184, 166)' },
  Tablet: { bg: 'rgba(139, 92, 246, 0.72)', border: 'rgb(139, 92, 246)' },
  'Streaming Dongle': { bg: 'rgba(245, 158, 11, 0.72)', border: 'rgb(245, 158, 11)' },
};

const fixText = (value) => {
  if (!value) return '';

  const replacements = {
    'AÃ§Ã£o': 'Ação',
    'AÃÂ§ÃÂ£o': 'Ação',
    'ComÃ©dia': 'Comédia',
    'ComÃÂ©dia': 'Comédia',
    'FicÃ§Ã£o CientÃ­fica': 'Ficção Científica',
    'FicÃÂ§ÃÂ£o CientÃÂ­fica': 'Ficção Científica',
    'DocumentÃ¡rio': 'Documentário',
    'DocumentÃÂ¡rio': 'Documentário',
    'AnimaÃ§Ã£o': 'Animação',
    'AnimaÃÂ§ÃÂ£o': 'Animação',
    'Dispositivo de streaming (Ex: Chromecast': 'Streaming Dongle',
    'Fire TV Stick)': 'Streaming Dongle',
    'Fire TV Stick': 'Streaming Dongle',
    'Dispositivo de streaming (Ex: Chromecast, Fire TV Stick)': 'Streaming Dongle',
    Chromecast: 'Streaming Dongle',
  };

  return replacements[value.trim().replace(/^"|"$/g, '')] || value.trim().replace(/^"|"$/g, '');
};

export const DispositivosPorGeneroChart = () => {
  const { data, isLoading, isError } = useDispositivosPorGenero();

  if (isLoading || !data) {
    return (
      <div className="dashboard-card card-large">
        <h3>Dispositivos por Gênero Assistido</h3>
        <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Carregando dados do gráfico...</p>
        </div>
      </div>
    );
  }

  if (isError || Object.keys(data).length === 0) {
    return (
      <div className="dashboard-card card-large">
        <h3>Dispositivos por Gênero Assistido</h3>
        <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Erro ao carregar os dados ou dados não encontrados.</p>
        </div>
      </div>
    );
  }

  const normalizedData = Object.entries(data).reduce((acc, [genre, devices]) => {
    const genreLabel = fixText(genre);
    acc[genreLabel] = acc[genreLabel] || {};

    Object.entries(devices).forEach(([device, total]) => {
      const deviceLabel = fixText(device);
      acc[genreLabel][deviceLabel] = (acc[genreLabel][deviceLabel] || 0) + total;
    });

    return acc;
  }, {});

  const labels = GENERO_ORDER.filter((genre) => normalizedData[genre]);
  const devices = DEVICE_ORDER.filter((device) =>
    labels.some((genre) => (normalizedData[genre]?.[device] || 0) > 0)
  );

  const datasets = devices.map((device) => {
    const color = DEVICE_COLORS[device] || { bg: 'rgba(100, 116, 139, 0.65)', border: 'rgb(100, 116, 139)' };

    return {
      label: device,
      data: labels.map((genre) => normalizedData[genre]?.[device] || 0),
      backgroundColor: color.bg,
      borderColor: color.border,
      borderWidth: 1,
    };
  });

  const chartData = { labels, datasets };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        title: { display: true, text: 'Gênero assistido' },
        ticks: {
          maxRotation: 0,
          autoSkip: false,
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: { precision: 0 },
        title: { display: true, text: 'Frequência de uso' },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Preferência de dispositivo por gênero de conteúdo',
      },
      legend: {
        position: 'top',
        labels: {
          boxWidth: 14,
          boxHeight: 14,
          padding: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y} respostas`,
        },
      },
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div className="dashboard-card card-large">
      <h3>Dispositivos por Gênero Assistido</h3>
      <div className="chart-wrapper">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};
