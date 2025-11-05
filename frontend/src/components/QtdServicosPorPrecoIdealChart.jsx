import React, { useEffect, useMemo } from 'react';
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'; // Importa o plugin
import { useQtdServicosPorPrecoIdeal } from '../hooks/useQtdServicosPorPrecoIdeal';

// Registra todos os componentes necessários do Chart.js, incluindo o plugin
ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

/**
 * Processa os dados brutos da API para o formato do Bubble Chart.
 * Agrupa pontos iguais e usa a contagem como raio (r).
 */
const processDataForBubbleChart = (data) => {
  if (!data || data.length === 0) {
    return [];
  }

  const concentrationMap = new Map();

  // 1. Agrupa os dados e conta a frequência
  data.forEach(item => {
    const key = `${item.precoIdeal}-${item.qtdAssinaturas}`;
    if (!concentrationMap.has(key)) {
      concentrationMap.set(key, {
        x: item.precoIdeal,
        y: item.qtdAssinaturas,
        r: 0, // 'r' é o raio da bolha
      });
    }
    // Aumenta o raio para cada ocorrência. Ajuste o multiplicador (ex: * 4) se quiser bolhas maiores.
    concentrationMap.get(key).r += 3;
  });

  return Array.from(concentrationMap.values());
};

export const QtdServicosPorPrecoIdealChart = () => {
  // 1. Busca os dados com React Query
  const { data: rawData, isLoading, isError } = useQtdServicosPorPrecoIdeal();

  // 2. Processa os dados para o formato do gráfico
  const processedData = useMemo(() => processDataForBubbleChart(rawData), [rawData]);

  if (isLoading) {
    return <div>Carregando gráfico...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar os dados.</div>;
  }

  useEffect(() => {
    
  }, [])

  // 3. Define a estrutura de dados para o Chart.js
  const chartData = {
    datasets: [
      {
        type: 'bubble',
        label: 'Concentração',
        data: processedData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
      {
        type: 'line', // Tipo 'line' para a curva de regressão
        label: 'Curva Ideal (Polinomial)',
        data: processedData, // O plugin usa esses dados para calcular a curva
        borderColor: 'rgba(211, 47, 47, 0.8)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0, // Não mostrar pontos, apenas a linha
        // Configuração do plugin de regressão

      },
    ],
  };

  // 4. Define as opções de visualização do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Preço ideal x Quantidade de serviços assinados',
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            // Tooltip customizado para mostrar X, Y e o Raio (Concentração)
            const label = context.dataset.label || '';
            if (context.dataset.type === 'bubble') {
              const rawValue = context.raw.r / 3; // Inverte o cálculo do raio
              return `${label}: (Preço: R$${context.parsed.x}, Qtd: ${context.parsed.y}, Contagem: ${rawValue})`;
            }
            return false; // Esconde o tooltip para a linha de regressão
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Quantidade de serviços assinados',
        },
        min: 0,
        max: 7, // Ajustado para corresponder à imagem
      },
      x: {
        title: {
          display: true,
          text: 'Preço Ideal (R$)',
        },
        min: 5,
        max: 55, // Ajustado para corresponder à imagem
      },
    },
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Bubble key={processedData.length > 0 ? 'data-loaded' : 'no-data'} 
           options={options} 
           data={chartData} />
    </div>
  );
};