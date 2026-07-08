import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useHorasSemanais } from '../hooks/useHorasSemanais';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const HORAS_ORDER = ['Raramente', 'Até 2 horas', 'Até 4 horas', 'Mais que 4 horas'];

const COLOR_MAP = {
  Raramente: '#94a3b8',
  'Até 2 horas': '#3b82f6',
  'Até 4 horas': '#f59e0b',
  'Mais que 4 horas': '#22c55e',
  default: '#cbd5e1',
};

const fixText = (value) => {
  const replacements = {
    'AtÃ© 2 horas': 'Até 2 horas',
    'AtÃÂ© 2 horas': 'Até 2 horas',
    'AtÃ© 4 horas': 'Até 4 horas',
    'AtÃÂ© 4 horas': 'Até 4 horas',
  };

  return replacements[value] || value;
};

export const DistribuicaoHorasSemanaisChart = () => {
  const { data: apiData, isLoading, isError, error } = useHorasSemanais();

  const chartData = useMemo(() => {
    if (!apiData) {
      return null;
    }

    const normalized = Object.entries(apiData).reduce((acc, [label, value]) => {
      const normalizedLabel = fixText(label);
      acc[normalizedLabel] = (acc[normalizedLabel] || 0) + value;
      return acc;
    }, {});

    const labels = HORAS_ORDER.filter((label) => normalized[label] > 0);
    const dataValues = labels.map((label) => normalized[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Respostas',
          data: dataValues,
          backgroundColor: labels.map((label) => COLOR_MAP[label] || COLOR_MAP.default),
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  }, [apiData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 14,
          boxHeight: 14,
          padding: 14,
        },
      },
      title: {
        display: true,
        text: 'Distribuição de horas semanais de streaming',
        font: { size: 16 },
        padding: { bottom: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const total = context.chart.data.datasets[0].data.reduce((sum, item) => sum + item, 0);
            const percentage = total ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${context.label}: ${value} respostas (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold',
          size: 13,
          family: 'Helvetica, Arial, sans-serif',
        },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((sum, item) => sum + item, 0);
          const percentage = total ? (value / total) * 100 : 0;
          return percentage < 6 ? '' : `${percentage.toFixed(1)}%`;
        },
      },
    },
  };

  if (isLoading) {
    return <div>Carregando dados do gráfico...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar dados: {error.message}</div>;
  }

  if (!chartData || chartData.labels.length === 0) {
    return <div>Sem dados para exibir.</div>;
  }

  return (
    <div style={{ position: 'relative', height: '360px', width: '100%', maxWidth: '460px', margin: 'auto' }}>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};
