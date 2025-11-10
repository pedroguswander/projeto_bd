// src/components/MediaNotasObras.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { useMediaNotasObras } from "../hooks/useMediaNotasObra";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Loader2 } from "lucide-react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const MediaNotasObrasChart = ({ obraCodigo = null }) => {
  const { data, isLoading, isError } = useMediaNotasObras(obraCodigo);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-gray-600" size={32} />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500 text-center">Erro ao carregar dados.</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center">Nenhuma informação encontrada.</p>;
  }

  const labels = data.map((_, i) => `Obra ${i + 1}`);
  const valores = data.map((obra) => obra.media_nota);
  const nomesObras = data.map((obra) => obra.nome);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Média das notas",
        data: valores,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return nomesObras[index]; // mostra o nome da obra no hover
          },
          label: (tooltipItem) => `Média: ${tooltipItem.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: { display: false }, // não mostra nomes das obras no eixo X
      y: {
        beginAtZero: true,
        title: { display: true, text: "Notas" },
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-semibold mb-4 text-center">Média das Notas</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};
