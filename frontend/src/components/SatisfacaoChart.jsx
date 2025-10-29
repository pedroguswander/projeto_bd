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
import { useSatisfacao } from '../hooks/useSatisfacao';

// Registra os componentes do Chart.js e o plugin de labels
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Registra o plugin que você configurou
);

const SatisfacaoChart = () => {
  // 1. Busca os dados usando o hook (React Query)
  const { data: apiData, isLoading, isError } = useSatisfacao();

  // 2. Trata os estados de carregamento e erro
  if (isLoading) {
    return (
      <div className="dashboard-card card-large">
        <h3>Nível de Satisfação por Gênero</h3>
        <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Carregando dados do gráfico...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-card card-large">
        <h3>Nível de Satisfação por Gênero</h3>
        <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Erro ao carregar os dados.</p>
        </div>
      </div>
    );
  }

  // 3. Prepara os dados do gráfico (aqui está a mágica)
  // Usamos sua configuração, mas tornamos os dados dinâmicos.

  const satisfacaoLabels = ['Feminino', 'Masculino'];
  
  // *** Ponto principal: Mapeia os dados da API para o array do gráfico ***
  const dadosValoresSatisfacao = [
    apiData.media_feminino,
    apiData.media_masculino
  ];

  const corSatisfacao = 'rgba(173, 216, 230, 0.8)';
  const bordaSatisfacao = 'rgb(173, 216, 230)';

  // Configuração dos DADOS para o <Bar>
  const chartData = {
    labels: satisfacaoLabels,
    datasets: [{
      label: 'Nível de satisfação',
      data: dadosValoresSatisfacao, // <-- DADOS VINDOS DA API
      backgroundColor: corSatisfacao,
      borderColor: bordaSatisfacao,
      borderWidth: 1,
      borderRadius: 5
    }]
  };

  // Configuração das OPÇÕES para o <Bar> (exatamente a que você enviou)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Importante para o gráfico preencher o container
    scales: {
      y: {
        beginAtZero: true,
        max: 4.5,
        ticks: {
          stepSize: 0.5,
          callback: function(value) { return value.toFixed(1); },
          color: '#666'
        },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        title: {
          display: true,
          text: 'Nível de Satisfação',
          font: { size: 14, weight: 'bold' },
          color: '#333'
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#666' },
        title: {
          display: true,
          text: 'Gênero',
          font: { size: 14, weight: 'bold' },
          color: '#333'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: { color: '#333' }
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        offset: 4,
        font: { size: 14, weight: 'bold' },
        color: '#444',
        formatter: function(value) {
          return value.toFixed(2); // Formata o label de dados
        }
      }
    }
  };

  // 4. Renderiza o card e o gráfico
  return (
    <div className="dashboard-card card-large">
      <h3>Nível de Satisfação por Gênero</h3>
      
      {/* Container para o gráfico */}
      <div className="chart-wrapper">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default SatisfacaoChart;