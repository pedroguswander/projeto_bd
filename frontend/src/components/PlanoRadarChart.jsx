// src/components/PlanoRadarChart.js

import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { usePlanoData } from '../hooks/usePlanoData';

// Registra todos os componentes necessários do Chart.js
ChartJS.register(...registerables);

// Configurações do gráfico
const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'Análise Comparativa de Planos de Assinatura',
            font: { size: 20 }
        },
        // --- HOVER SIMPLES (TOOLTIP) CUSTOMIZADO ---
        tooltip: {
            // Garante que o tooltip siga o ponto mais próximo
            mode: 'index',
            intersect: false, 
            
            // Personaliza o texto da dica de ferramenta
            callbacks: {
                // Rótulo principal (exibe a métrica e o valor formatado)
                label: function(context) {
                    let label = context.dataset.label || ''; // Nome do Plano (ex: "Padrão")

                    if (label) {
                        label += ': ';
                    }
                    // Adiciona o valor formatado com duas casas decimais
                    label += context.formattedValue + ' %';
                    return label;
                },
                // Título da dica de ferramenta (exibe a Métrica - "Preço Relativo")
                title: function(context) {
                    // O rótulo do eixo polar é a métrica
                    return context[0].label; 
                }
            }
        }
    },
    scales: {
        r: {
            angleLines: {
                display: true
            },
            suggestedMin: 0, 
            suggestedMax: 100, 
            pointLabels: {
                font: {
                    size: 14
                }
            },
            ticks: {
                stepSize: 25, 
                callback: function(value) {
                    return value > 0 ? value + '' : null; 
                }
            }
        }
    }
};

export function PlanoRadarChart() {
    // 1. Pega os dados usando o hook customizado
    const { data: chartData, isLoading, isError, error } = usePlanoData();

    if (isLoading) {
        return <div>Carregando dados dos planos... ⏳</div>;
    }

    if (isError) {
        return <div>Erro ao carregar dados: {error.message} 🚨</div>;
    }
    
    // 2. Renderiza o Chart.js
    return (
        <div style={{ width: '600px', height: '600px', margin: 'auto' }}>
            <h2></h2>
            <Radar data={chartData} options={options} />
        </div>
    );
}