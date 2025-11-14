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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Loader2 } from "lucide-react";

// ✅ registra o plugin e elementos
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

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

  const labels =
    obraCodigo && data.length === 1
      ? [data[0].nome]
      : data.map((_, i) => `Obra ${i + 1}`);

  const valores = data.map((obra) => obra.media_nota);
  const nomesObras = data.map((obra) => obra.nome);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Média das notas",
        data: valores,
        backgroundColor: "rgba(255, 206, 86, 0.7)", // 🟡 amarelo claro
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
        barThickness: obraCodigo ? 40 : undefined,
        maxBarThickness: obraCodigo ? 50 : 80,
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
            return nomesObras[index];
          },
          label: (tooltipItem) => `Média: ${tooltipItem.raw.toFixed(2)}`,
        },
      },
      // 🎨 Exibição bonita dos valores nas barras
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#374151", // cinza escuro
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => value.toFixed(2),
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: !!obraCodigo,
          text: obraCodigo ? "Obra" : "",
        },
        ticks: {
          display: !!obraCodigo,
          color: "#555",
          font: { size: 13 },
        },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Notas" },
        ticks: { stepSize: 1, color: "#555", font: { size: 12 } },
        grid: { color: "rgba(200,200,200,0.2)" },
      },
    },
  };

  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <Bar data={chartData} options={options} />
    </div>
  );
};
