import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useGeneroPorAssistido } from '../hooks/useGeneroPorAssistido';
import { useTotaisPorGenero } from '../hooks/useTotalPorGenero'; // hook correto

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const GeneroPorAssistidoChart = () => {
  const { data, isLoading, isError } = useGeneroPorAssistido();
  const { data: totalData } = useTotaisPorGenero(); // pega total absoluto

  if (isLoading || !totalData) {
    return (
      <div className="dashboard-card card-medium">
        <h3>Gênero por Assistido</h3>
        <div
          className="chart-wrapper"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <p>Carregando dados do gráfico...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-card card-medium">
        <h3>Gênero por Assistido</h3>
        <div
          className="chart-wrapper"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <p>Erro ao carregar os dados.</p>
        </div>
      </div>
    );
  }

  // Labels dos gêneros assistidos
  const labels = [...Object.keys(data)];

  // Arrays de dados por gênero
  const feminino = labels.map(label => data[label]?.Feminino || 0);
  const masculino = labels.map(label => data[label]?.Masculino || 0);

  // Adiciona barra "Total" com valores absolutos do banco
  labels.push('Total');
  feminino.push(totalData.Feminino);
  masculino.push(totalData.Masculino);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Feminino',
        data: feminino,
        backgroundColor: 'rgba(255, 105, 180, 0.7)',
        borderColor: 'rgb(255, 105, 180)',
        borderWidth: 1,
        borderRadius: 5
      },
      {
        label: 'Masculino',
        data: masculino,
        backgroundColor: 'rgba(100, 149, 237, 0.7)',
        borderColor: 'rgb(100, 149, 237)',
        borderWidth: 1,
        borderRadius: 5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#666' },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        title: {
          display: true,
          text: 'Quantidade de Pessoas',
          font: { size: 14, weight: 'bold' },
          color: '#333'
        }
      },
      x: {
        ticks: { color: '#666' },
        grid: { display: false },
        title: {
          display: true,
          text: 'Gênero',
          font: { size: 14, weight: 'bold' },
          color: '#333'
        }
      }
    },
    plugins: {
      legend: { display: true, position: 'top', labels: { color: '#333' } },
      datalabels: {
        anchor: 'end',
        align: 'top',
        offset: 4,
        font: { size: 14, weight: 'bold' },
        color: '#444',
        formatter: (value) => value
      }
    }
  };

  return (
    <div className="dashboard-card card-medium">
      <h3>Gêneros X Gênero Assistido</h3>
      <div className="chart-wrapper">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default GeneroPorAssistidoChart;
