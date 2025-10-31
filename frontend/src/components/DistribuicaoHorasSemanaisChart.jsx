// src/components/DistribuicaoHorasSemanaisChart/DistribuicaoHorasSemanaisChart.jsx

import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
// Importa o plugin de rótulos de dados
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Certifique-se de que o caminho do hook está correto
import { useHorasSemanais } from '../hooks/useHorasSemanais'; // Ajustei o caminho relativo

// Registra os elementos necessários do Chart.js, INCLUINDO o plugin
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

/**
 * Mapeia as chaves da API (labels) para as cores exatas da imagem de exemplo.
 */
const COLOR_MAP = {
  // Cores baseadas na sua imagem de exemplo:
  'Menos de 2 horas': '#00aaff', // Azul
  'Até 2 horas': '#ff4d4d',      // Vermelho
  'Até 4 horas': '#ff9900',      // Laranja
  'Mais que 4 horas': '#66ff66', // Verde
  'default': '#cccccc'           // Cor padrão
};

export const DistribuicaoHorasSemanaisChart = () => {
  const { data: apiData, isLoading, isError, error } = useHorasSemanais();

  /**
   * Transforma os dados da API para o formato do Chart.js.
   */
  const chartData = useMemo(() => {
    if (!apiData) {
      return null;
    }

    const labels = Object.keys(apiData);
    const dataValues = Object.values(apiData);
    const backgroundColors = labels.map(label => COLOR_MAP[label] || COLOR_MAP['default']);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Nº de Respostas',
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: '#ffffff', // Borda branca entre as fatias
          borderWidth: 2,
        },
      ],
    };
  }, [apiData]);

  // Opções de configuração do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Análise da Distribuição de uso de tela (semanal)',
        font: {
          size: 18,
        },
        padding: {
          bottom: 20,
        }
      },
      tooltip: {
        callbacks: {
          // Customiza o tooltip para mostrar porcentagem
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1) + '%';
            return `${label}: ${value} (${percentage})`;
          }
        }
      },
      // === NOVO: Configuração do Plugin DataLabels ===
      datalabels: {
        color: '#ffffff', // Cor da fonte: branca
        font: {
          weight: 'bold',
          size: 14, // Tamanho da fonte para destaque
          family: 'Helvetica, Arial, sans-serif', // Família da fonte
        },
        formatter: (value, context) => {
          // Calcula e retorna o valor em porcentagem
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = (value / total) * 100;
          return percentage.toFixed(1) + '%';
        },
      },
      // =============================================
    },
  };

  // --- Renderização do Componente ---

  if (isLoading) {
    return <div>Carregando dados do gráfico...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar dados: {error.message}</div>;
  }

  if (!chartData) {
    return <div>Sem dados para exibir.</div>;
  }

  return (
    // É importante definir uma altura para o container do gráfico
    <div style={{ position: 'relative', height: '400px', width: '400px', margin: 'auto' }}>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

// export default DistribuicaoHorasSemanaisChart;