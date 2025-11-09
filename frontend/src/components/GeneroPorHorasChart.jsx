import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement, 
  LineElement,  
  Title,
  Tooltip,
  Legend,
  Filler 
} from 'chart.js';
import { useGeneroPorHoras } from '../hooks/useGeneroPorHoras';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HORAS_ORDER = [
    'Raramente', 
    'Até 2 horas', 
    'Até 4 horas', 
    'Mais que 4 horas',
    'Semanalmente', 
    'Diariamente'   
];

const GENERO_COLORS = {
    'Ação': { bg: 'rgba(255, 99, 132, 0.5)', border: 'rgb(255, 99, 132)' },
    'Comédia': { bg: 'rgba(54, 162, 235, 0.5)', border: 'rgb(54, 162, 235)' },
    'Drama': { bg: 'rgba(255, 205, 86, 0.5)', border: 'rgb(255, 205, 86)' },
    'Romance': { bg: 'rgba(75, 192, 192, 0.5)', border: 'rgb(75, 192, 192)' },
    'Ficção Científica': { bg: 'rgba(153, 102, 255, 0.5)', border: 'rgb(153, 102, 255)' },
    'Terror': { bg: 'rgba(201, 203, 207, 0.5)', border: 'rgb(201, 203, 207)' },
    'Documentário': { bg: 'rgba(255, 159, 64, 0.5)', border: 'rgb(255, 159, 64)' },
    'Animação': { bg: 'rgba(23, 162, 184, 0.5)', border: 'rgb(23, 162, 184)' },
};

export const GeneroPorHorasChart = () => {
    const { data, isLoading, isError } = useGeneroPorHoras();

    if (isLoading) {
        return (
            <div className="dashboard-card card-large">
                <h3>Gênero por Horas Semanais</h3>
                <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p>Carregando dados do gráfico...</p>
                </div>
            </div>
        );
    }

    if (isError || !data || Object.keys(data).length === 0) {
        return (
            <div className="dashboard-card card-large">
                <h3>Gênero por Horas Semanais</h3>
                <div className="chart-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p>Erro ao carregar os dados ou dados não encontrados.</p>
                </div>
            </div>
        );
    }

    const allGenres = new Set();
    Object.values(data).forEach(horasData => {
        Object.keys(horasData).forEach(genre => allGenres.add(genre));
    });
    const genres = Array.from(allGenres).sort(); 

    const labels = HORAS_ORDER.filter(h => Object.keys(data).includes(h));

    const datasets = genres.map(genre => {
        const color = GENERO_COLORS[genre] || { bg: 'rgba(0, 0, 0, 0.1)', border: 'rgb(0, 0, 0)' };

        const genreData = labels.map(label => data[label]?.[genre] || 0);

        return {
            label: genre,
            data: genreData,
            backgroundColor: color.bg,
            borderColor: color.border,
            fill: true, 
            tension: 0.4, 
            stack: 'stack-a', 
        };
    });

    const chartData = {
        labels,
        datasets,
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                stacked: true, 
                title: { display: true, text: 'Horas Semanais' }
            },
            y: {
                stacked: true,
                title: { display: true, text: 'Total de Respostas' }
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Gêneros Assistidos por Horas Semanais de Streaming',
            },
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div className="dashboard-card card-large">
            <h3>Gênero por Horas Semanais</h3>
            <div className="chart-wrapper">
                <Line options={chartOptions} data={chartData} />
            </div>
        </div>
    );
};