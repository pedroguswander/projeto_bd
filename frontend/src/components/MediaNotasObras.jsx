import React, { useState } from "react";
import { Search, XCircle, Loader2 } from "lucide-react"; 
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

// ✅ registra o plugin e elementos básicos do Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend); 

// --- Componente de Gráfico ---
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

  // Lógica para labels e dados
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
          label: (tooltipItem) => `Média: ${tooltipItem.raw.toFixed(2)}`,
        },
      },
      // datalabels removido
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

// --- Componente Principal ---
export const MediaNotasObras = () => {
  const [obraCodigo, setObraCodigo] = useState("");
  const [filtro, setFiltro] = useState(null);

  const handleBuscar = (e) => {
    e.preventDefault();
    const novoFiltro = obraCodigo.trim() === "" ? null : obraCodigo.trim();
    setFiltro(novoFiltro);
  };

  const limparFiltro = () => {
    setObraCodigo("");
    setFiltro(null);
  };

  const isSearching = !!filtro;

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Médias das Notas por Obra</h2>

      {/* BARRA DE PESQUISA UNIFICADA E ESTILIZADA */}
      <div className="flex justify-center mb-6">
        <form onSubmit={handleBuscar} className="flex items-center max-w-lg w-full rounded-xl overflow-hidden shadow-lg border border-indigo-200/50">
          
          <input
            type="number"
            placeholder="Digite o ID da obra para buscar..."
            value={obraCodigo}
            onChange={(e) => setObraCodigo(e.target.value)}
            className="flex-grow px-4 py-3 text-lg border-none focus:ring-0 focus:outline-none placeholder-gray-400"
          />
          
          <button
            type="submit"
            // CLASSES OTIMIZADAS: Adicionado 'shadow-none' e 'ring-0' para eliminar quaisquer vestígios de estilo padrão.
            className="bg-gray-900 text-white px-5 py-3 text-lg flex items-center justify-center hover:bg-gray-800 transition duration-150 disabled:opacity-50 h-full appearance-none border-none shadow-none ring-0"
          >
            <Search size={20} />
          </button>
        </form>

        {/* Botão Limpar */}
        {isSearching && (
          <button
            type="button"
            onClick={limparFiltro}
            className="ml-4 p-3 rounded-xl text-gray-600 hover:bg-gray-200 transition text-sm flex items-center gap-1"
          >
            <XCircle size={18} /> Limpar
          </button>
        )}
      </div>

      {/* Renderiza o Gráfico */}
      <MediaNotasObrasChart obraCodigo={filtro} />
    </div>
  );
};
