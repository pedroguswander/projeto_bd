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
import { useDispositivosPorGenero } from '../hooks/useDispositivosPorGenero';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const DISPOSITIVO_MAP = {
    'TV': 'TV',
    'Smartphone': 'Smartphone',
    'Computador/Notebook': 'Computador/Notebook',
    'Tablet': 'Tablet',
    
    'Dispositivo de streaming (Ex: Chromecast': 'Streaming Dongle', 
    '"Fire TV Stick"': 'Streaming Dongle', 
    'Fire TV Stick': 'Streaming Dongle', 
    
    'Dispositivo de streaming (Ex: Chromecast, Fire TV Stick)': 'Streaming Dongle', 
    'Chromecast': 'Streaming Dongle',
};

const DISPOSITIVO_COLORS = {
    'TV': { bg: 'rgba(255, 99, 132, 0.7)', border: 'rgb(255, 99, 132)' }, 
    'Smartphone': { bg: 'rgba(54, 162, 235, 0.7)', border: 'rgb(54, 162, 235)' }, 
    'Computador/Notebook': { bg: 'rgba(75, 192, 192, 0.7)', border: 'rgb(75, 192, 192)' },
    'Tablet': { bg: 'rgba(153, 102, 255, 0.7)', border: 'rgb(153, 102, 255)' },
    'Streaming Dongle': { bg: 'rgba(255, 159, 64, 0.7)', border: 'rgb(255, 159, 64)' },
};

export const DispositivosPorGeneroChart = () => {
    const { data, isLoading, isError } = useDispositivosPorGenero();

    if (isLoading || !data) {
        return (
            <div className="dashboard-card card-large">
                <h3>Dispositivos por Gênero Assistido</h3>
                <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p>Carregando dados do gráfico...</p>
                </div>
            </div>
        );
    }

    if (isError || Object.keys(data).length === 0) {
        return (
            <div className="dashboard-card card-large">
                <h3>Dispositivos por Gênero Assistido</h3>
                <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p>Erro ao carregar os dados ou dados não encontrados.</p>
                </div>
            </div>
        );
    }

    const labels = Object.keys(data).sort(); 

    const allDispositivosOriginais = new Set();
    Object.values(data).forEach(generoData => {
        Object.keys(generoData).forEach(dispositivo => allDispositivosOriginais.add(dispositivo));
    });
    
    const dispositivosRenomeados = Array.from(allDispositivosOriginais)
        .map(d => {
             const cleanKey = d.trim().replace(/^"|"$/g, ''); 
             return DISPOSITIVO_MAP[cleanKey] || cleanKey;
        })
        .filter((value, index, self) => self.indexOf(value) === index) 
        .sort();

    // 3. Cria os datasets (um para cada dispositivo renomeado)
    const datasets = dispositivosRenomeados.map(nomeCurto => {
        const color = DISPOSITIVO_COLORS[nomeCurto] || { bg: 'rgba(0, 0, 0, 0.4)', border: 'rgb(0, 0, 0)' };
        
        const dispositivoData = labels.map(genero => {
            let total = 0;
            Object.keys(data[genero] || {}).forEach(nomeOriginalWithSpace => {
                const cleanKey = nomeOriginalWithSpace.trim().replace(/^"|"$/g, '');
                const mappedName = DISPOSITIVO_MAP[cleanKey] || cleanKey;

                if (mappedName === nomeCurto) {
                    total += data[genero][nomeOriginalWithSpace];
                }
            });
            return total;
        });

        return {
            label: nomeCurto, 
            data: dispositivoData,
            backgroundColor: color.bg,
            borderColor: color.border,
            borderWidth: 1,
        };
    });

    const chartData = {
        labels,
        datasets,
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: false, 
                title: { display: true, text: 'Gênero Assistido' },

                barPercentage: 0.8,     
                categoryPercentage: 0.9, 
            },
            y: {
                stacked: false, 
                beginAtZero: true,
                title: { display: true, text: 'Frequência de Uso' }
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Preferência de Dispositivo por Gênero de Conteúdo',
            },
            legend: {
                position: 'top',
            },
            datalabels: {
                display: false, 
            }
        },
    };

    return (
        <div className="dashboard-card card-large">
            <h3>Dispositivos X Gênero Assistido</h3>
            <div className="chart-wrapper">
                <Bar options={chartOptions} data={chartData} />
            </div>
        </div>
    );
};