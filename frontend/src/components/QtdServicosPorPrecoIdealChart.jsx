import React, { useMemo } from 'react';
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { useQtdServicosPorPrecoIdeal } from '../hooks/useQtdServicosPorPrecoIdeal';

// 1. REGISTRO DO CHARTJS ATUALIZADO:
// Removidos LineElement e LineController, mantendo apenas o necessário para o Bubble Chart.
ChartJS.register(
  LinearScale,   // Necessário para as escalas X e Y
  PointElement,  // Usado para desenhar as bolhas
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
    // Aumenta o raio para cada ocorrência.
    concentrationMap.get(key).r += 3;
  });

  return Array.from(concentrationMap.values());
};

export const QtdServicosPorPrecoIdealChart = () => {
  // 1. Hooks no topo (corrigido anteriormente)
  const { data: rawData, isLoading, isError } = useQtdServicosPorPrecoIdeal();
  const processedData = useMemo(() => processDataForBubbleChart(rawData), [rawData]);

  // 2. useEffect removido, eliminando potencial problema de dependência.

  if (isLoading) {
    return <div>Carregando gráfico...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar os dados.</div>;
  }
  
  // Condição para tratar o caso de dados vazios após o carregamento
  if (!processedData || processedData.length === 0) {
    return <div>Nenhum dado de serviço encontrado para o gráfico.</div>;
  }


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
      // ⚠️ LINHA REMOVIDA AQUI: O dataset 'line' foi removido
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
              // Note: 'context.raw' só existe para datasets do tipo Bubble
              const rawValue = context.raw.r / 3; // Inverte o cálculo do raio
              return `${label}: (Preço: R$${context.parsed.x}, Qtd: ${context.parsed.y}, Contagem: ${rawValue})`;
            }
            return label; // Retorno padrão para outros tipos, embora só haja Bubble agora.
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
        max: 7,
      },
      x: {
        title: {
          display: true,
          text: 'Preço Ideal (R$)',
        },
        min: 10,
        max: 55,
      },
    },
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Bubble 
        // A 'key' anterior não é estritamente necessária se o componente for destruído corretamente
        // Mas se precisar dela para forçar a re-renderização em caso de dados vazios:
        key={processedData.length > 0 ? 'data-loaded' : 'no-data'} 
        options={options} 
        data={chartData} 
      />
    </div>
  );
};