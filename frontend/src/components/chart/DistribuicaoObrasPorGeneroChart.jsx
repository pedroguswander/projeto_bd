// src/components/DistribuicaoObrasPorGeneroChart.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useDistribuicaoObras } from '../../hooks/useDistribuicaoObras'; 
import './DistribuicaoObrasPorGeneroChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
  '#C9CBCF', '#7EBC89', '#F76B8A', '#2E8BC0', '#F9E795', '#A2D9CE'
];

const DistribuicaoObrasPorGeneroChart = () => {
  const { data, isLoading, isError, error } = useDistribuicaoObras();

  if (isLoading) {
    return <div className="dobg-chart-container">Carregando dados da distribuição de obras...</div>;
  }

  if (isError) {
    return (
      <div className="dobg-chart-container error">
        Erro ao carregar os dados: {error.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="dobg-chart-container no-data">
        Nenhuma obra encontrada por gênero para exibir.
      </div>
    );
  }

  const labels = data.map(item => item.genero);
  const totalObras = data.map(item => item.total_obras);

  const chartData = {
    labels,
    datasets: [
      {
        data: totalObras,
        backgroundColor: CHART_COLORS.slice(0, labels.length),
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label ? `${context.label}: ` : '';
            if (context.parsed !== null) {
              label +=
                new Intl.NumberFormat('pt-BR').format(context.parsed) +
                ' obras';
            }
            return label;
          }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="dobg-chart-card">
      <div className="dobg-chart-header">
        <h3>Distribuição de Obras por Gênero</h3>
      </div>

      <div className="dobg-chart-body">
        <div className="dobg-chart-wrapper">
          <Doughnut data={chartData} options={chartOptions} />
        </div>

        <div className="dobg-chart-legend-custom">
          {labels.map((label, index) => (
            <div key={label} className="dobg-legend-item">
              <span
                className="dobg-legend-color-box"
                style={{ backgroundColor: CHART_COLORS[index] }}
              />
              <span className="dobg-legend-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistribuicaoObrasPorGeneroChart;
