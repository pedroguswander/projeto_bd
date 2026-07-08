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
import { useGeneroPorHoras } from '../hooks/useGeneroPorHoras';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HORAS_ORDER = ['Raramente', 'Até 2 horas', 'Até 4 horas', 'Mais que 4 horas'];

const GENERO_COLORS = {
  'Ação': { bg: 'rgba(37, 99, 235, 0.78)', border: 'rgb(37, 99, 235)' },
  'Comédia': { bg: 'rgba(245, 158, 11, 0.78)', border: 'rgb(245, 158, 11)' },
  'Drama': { bg: 'rgba(16, 185, 129, 0.78)', border: 'rgb(16, 185, 129)' },
  'Romance': { bg: 'rgba(236, 72, 153, 0.78)', border: 'rgb(236, 72, 153)' },
  'Ficção Científica': { bg: 'rgba(139, 92, 246, 0.78)', border: 'rgb(139, 92, 246)' },
  'Terror': { bg: 'rgba(75, 85, 99, 0.78)', border: 'rgb(75, 85, 99)' },
  'Documentário': { bg: 'rgba(20, 184, 166, 0.78)', border: 'rgb(20, 184, 166)' },
  'Animação': { bg: 'rgba(239, 68, 68, 0.78)', border: 'rgb(239, 68, 68)' },
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
    'AtÃ© 2 horas': 'Até 2 horas',
    'AtÃÂ© 2 horas': 'Até 2 horas',
    'AtÃ© 4 horas': 'Até 4 horas',
    'AtÃÂ© 4 horas': 'Até 4 horas',
  };

  return replacements[value] || value;
};

export const GeneroPorHorasChart = () => {
  const { data, isLoading, isError } = useGeneroPorHoras();

  if (isLoading) {
    return (
      <div className="dashboard-card card-large">
        <h3>Gênero por Horas Semanais</h3>
        <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Carregando dados do gráfico...</p>
        </div>
      </div>
    );
  }

  if (isError || !data || Object.keys(data).length === 0) {
    return (
      <div className="dashboard-card card-large">
        <h3>Gênero por Horas Semanais</h3>
        <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Erro ao carregar os dados ou dados não encontrados.</p>
        </div>
      </div>
    );
  }

  const normalizedData = Object.entries(data).reduce((acc, [hours, genresByHour]) => {
    const hourLabel = fixText(hours);
    acc[hourLabel] = acc[hourLabel] || {};

    Object.entries(genresByHour).forEach(([genre, total]) => {
      const genreLabel = fixText(genre);
      acc[hourLabel][genreLabel] = (acc[hourLabel][genreLabel] || 0) + total;
    });

    return acc;
  }, {});

  const allGenres = new Set();
  Object.values(normalizedData).forEach((hoursData) => {
    Object.keys(hoursData).forEach((genre) => allGenres.add(genre));
  });

  const labels = HORAS_ORDER.filter((hour) => Object.keys(normalizedData).includes(hour));
  const genres = Array.from(allGenres).sort();

  const datasets = genres.map((genre) => {
    const color = GENERO_COLORS[genre] || { bg: 'rgba(100, 116, 139, 0.65)', border: 'rgb(100, 116, 139)' };

    return {
      label: genre,
      data: labels.map((label) => normalizedData[label]?.[genre] || 0),
      backgroundColor: color.bg,
      borderColor: color.border,
      borderWidth: 1,
    };
  });

  const chartData = { labels, datasets };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: 'Horas semanais' },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: { precision: 0 },
        title: { display: true, text: 'Total de respostas' },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Gêneros assistidos por faixa de horas semanais',
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
    },
  };

  return (
    <div className="dashboard-card card-large">
      <h3>Gênero por Horas Semanais</h3>
      <div className="chart-wrapper">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};
