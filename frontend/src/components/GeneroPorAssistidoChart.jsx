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
import { useGeneroPorAssistido } from '../hooks/useGeneroPorAssistido';
import { useTotaisPorGenero } from '../hooks/useTotalPorGenero';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const LABELS = {
  acao: 'A\u00e7\u00e3o',
  animacao: 'Anima\u00e7\u00e3o',
  comedia: 'Com\u00e9dia',
  documentario: 'Document\u00e1rio',
  drama: 'Drama',
  ficcao: 'Fic\u00e7\u00e3o Cient\u00edfica',
  romance: 'Romance',
  terror: 'Terror',
};

const GENRE_ORDER = [
  LABELS.acao,
  LABELS.animacao,
  LABELS.comedia,
  LABELS.documentario,
  LABELS.drama,
  LABELS.ficcao,
  LABELS.romance,
  LABELS.terror,
];

const decodeMojibake = (value) => {
  if (!value) return '';

  return String(value)
    .replace(/ÃƒÂ§|Ã§/g, '\u00e7')
    .replace(/ÃƒÂ£|Ã£/g, '\u00e3')
    .replace(/ÃƒÂ¡|Ã¡/g, '\u00e1')
    .replace(/ÃƒÂ©|Ã©/g, '\u00e9')
    .replace(/ÃƒÂª|Ãª/g, '\u00ea')
    .replace(/ÃƒÂ­|Ã­/g, '\u00ed')
    .replace(/ÃƒÂ³|Ã³/g, '\u00f3')
    .replace(/ÃƒÂº|Ãº/g, '\u00fa');
};

const normalizeGenre = (value) => {
  const text = decodeMojibake(value).toLowerCase();

  if (text.includes('fic')) return LABELS.ficcao;
  if (text.includes('anim')) return LABELS.animacao;
  if (text.includes('com')) return LABELS.comedia;
  if (text.includes('document')) return LABELS.documentario;
  if (text.includes('drama')) return LABELS.drama;
  if (text.includes('romance')) return LABELS.romance;
  if (text.includes('terror')) return LABELS.terror;
  if (text.includes('a\u00e7') || text.includes('acao')) return LABELS.acao;

  return decodeMojibake(value);
};

const normalizeData = (data) =>
  Object.entries(data || {}).reduce((acc, [genre, valuesByUserGender]) => {
    const genreLabel = normalizeGenre(genre);
    acc[genreLabel] = acc[genreLabel] || {};

    Object.entries(valuesByUserGender || {}).forEach(([userGender, total]) => {
      const userGenderLabel = decodeMojibake(userGender);
      acc[genreLabel][userGenderLabel] = (acc[genreLabel][userGenderLabel] || 0) + total;
    });

    return acc;
  }, {});

const GeneroPorAssistidoChart = () => {
  const { data, isLoading, isError } = useGeneroPorAssistido();
  const { data: totalData } = useTotaisPorGenero();

  if (isLoading || !totalData) {
    return (
      <div className="dashboard-card card-medium">
        <h3>{'G\u00eanero por Conte\u00fado Assistido'}</h3>
        <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>{'Carregando dados do gr\u00e1fico...'}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-card card-medium">
        <h3>{'G\u00eanero por Conte\u00fado Assistido'}</h3>
        <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Erro ao carregar os dados.</p>
        </div>
      </div>
    );
  }

  const normalizedData = normalizeData(data);
  const labels = GENRE_ORDER.filter((genre) => normalizedData[genre]);

  const feminino = labels.map((label) => normalizedData[label]?.Feminino || 0);
  const masculino = labels.map((label) => normalizedData[label]?.Masculino || 0);

  labels.push('Total');
  feminino.push(totalData.Feminino || 0);
  masculino.push(totalData.Masculino || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Feminino',
        data: feminino,
        backgroundColor: 'rgba(236, 72, 153, 0.72)',
        borderColor: 'rgb(236, 72, 153)',
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'Masculino',
        data: masculino,
        backgroundColor: 'rgba(59, 130, 246, 0.72)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#666', precision: 0 },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        title: {
          display: true,
          text: 'Quantidade de pessoas',
          font: { size: 14, weight: 'bold' },
          color: '#333',
        },
      },
      x: {
        ticks: {
          color: '#666',
          maxRotation: 0,
          autoSkip: false,
        },
        grid: { display: false },
        title: {
          display: true,
          text: 'G\u00eanero assistido',
          font: { size: 14, weight: 'bold' },
          color: '#333',
        },
      },
    },
    plugins: {
      legend: { display: true, position: 'top', labels: { color: '#333' } },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y} pessoas`,
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        offset: 4,
        font: { size: 13, weight: 'bold' },
        color: '#444',
        formatter: (value) => value || '',
      },
    },
  };

  return (
    <div className="dashboard-card card-medium">
      <h3>{'G\u00eanero por Conte\u00fado Assistido'}</h3>
      <div className="chart-wrapper">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default GeneroPorAssistidoChart;
