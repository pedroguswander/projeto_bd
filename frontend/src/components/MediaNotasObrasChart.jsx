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
// 1. ✅ REINTRODUZIR o plugin datalabels
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Loader2 } from "lucide-react";

// 2. ✅ REGISTRAR o plugin novamente
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

// Estilos em CSS-in-JS (mantidos do passo anterior)
const chartStyles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "160px", 
  },
  loaderIcon: {
    animation: "spin 1s linear infinite",
    color: "#4b5563", 
  },
  errorText: {
    color: "#ef4444", 
    textAlign: "center",
  },
  infoText: {
    color: "#6b7280", 
    textAlign: "center",
  },
  chartWrapper: {
    padding: "16px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "16px", 
  },
};

const spinAnimation = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  if (!document.getElementById('spin-style')) {
    const style = document.createElement('style');
    style.id = 'spin-style';
    style.innerHTML = spinAnimation;
    document.head.appendChild(style);
  }
}

export const MediaNotasObrasChart = ({ obraCodigo = null }) => {
  const { data, isLoading, isError } = useMediaNotasObras(obraCodigo);

  if (isLoading) {
    const loaderStyle = { ...chartStyles.loaderIcon, ...{ width: '32px', height: '32px' } };
    return (
      <div style={chartStyles.loadingContainer}>
        <Loader2 style={loaderStyle} />
      </div>
    );
  }

  if (isError) {
    return <p style={chartStyles.errorText}>Erro ao carregar dados.</p>;
  }

  if (!data || data.length === 0) {
    return <p style={chartStyles.infoText}>Nenhuma informação encontrada.</p>;
  }

  const labels =
    obraCodigo && data.length === 1
      ? [data[0].nome]
      : data.map((obra) => `Obra ${obra.codigo}`); 

  const valores = data.map((obra) => obra.media_nota);
  const nomesObras = data.map((obra) => obra.nome);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Média das notas",
        data: valores,
        backgroundColor: "rgba(255, 206, 86, 0.7)", 
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
          label: (tooltipItem) => `Média: ${parseFloat(tooltipItem.raw).toFixed(2)}`,
        },
      },
      // 3. ✅ LÓGICA CONDICIONAL: 
      // datalabels.display é true SÓ SE obraCodigo for fornecido
      datalabels: {
        // Se obraCodigo existe e não é null/undefined (true), exibe. Caso contrário (false), oculta.
        display: !!obraCodigo,
        anchor: "end",
        align: "top",
        color: "#374151", // cinza escuro
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => parseFloat(value).toFixed(2),
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: !!obraCodigo,
          text: obraCodigo ? "Obra: " + nomesObras[0] : "Obras",
        },
        ticks: {
          display: !!obraCodigo,
          color: "#555",
          font: { size: 13 },
        },
      },
      y: {
        beginAtZero: true,
        max: 5,
        title: { display: true, text: "Notas" },
        ticks: { stepSize: 1, color: "#555", font: { size: 12 } },
        grid: { color: "rgba(200,200,200,0.2)" },
      },
    },
  };

  return (
      <Bar data={chartData} options={options} />
  );
};