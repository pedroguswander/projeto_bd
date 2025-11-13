import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useEvolucaoNovasContas from "../../hooks/useEvolucaoNovasContas";
import "./EvolucaoNovasContasChart.css";

// Registro dos componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const monthLabels = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default function EvolucaoNovasContasChart({ ano = 2024 }) {
  // Hook customizado para buscar os dados
  const { data, isLoading, isError } = useEvolucaoNovasContas(ano);

  // Mapeia os dados, preenchendo com 0 para meses sem dados
  const counts = data?.countsByMonth 
    ? data.countsByMonth.map((d) => d.quantidade ?? 0) 
    : Array(12).fill(0);

  // Calcula variação mês a mês (percent)
  const percentChange = counts.map((value, idx) => {
    if (idx === 0) return null;
    const prev = counts[idx - 1];
    // Se o mês anterior for 0, evitamos a divisão por zero e a variação é nula
    if (prev === 0) return null; 
    return ((value - prev) / prev) * 100;
  });

  // Define cor dos pontos baseado na variação para o mês em questão
  const pointColors = counts.map((_, idx) => {
    if (idx === 0) return "#9CA3AF"; // cinza para o primeiro ponto
    const change = percentChange[idx];
    if (change == null) return "#9CA3AF"; // cinza se não houver variação anterior (incluindo 0/0)
    // Verde se >= 0 (incluindo 0), Vermelho se < 0
    return change >= 0 ? "#10B981" : "#EF4444"; 
  });

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: `Novas contas em ${ano}`,
        data: counts,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.1)",
        tension: 0.3,
        pointRadius: 6,
        pointBackgroundColor: pointColors, // Cor customizada do ponto
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const idx = context.dataIndex;
            const value = context.parsed.y;
            const pct = percentChange[idx];
            
            // 1. Linha principal (Valor)
            const mainLabel = `Total: ${value}`;

            // 2. Linha de Variação
            if (pct === null) {
              // Primeiro mês ou mês com variação não aplicável (anterior = 0)
              return [mainLabel, "Variação: Não aplicável"];
            }

            const prefix = pct >= 0 ? "+" : "";
            
            // Define o emoji e a cor do texto (a cor do texto é o padrão do tooltip,
            // mas o emoji dá o feedback visual)
            let emoji = "➖"; // Padrão para 0%
            if (pct > 0) {
                emoji = "📈"; // Verde
            } else if (pct < 0) {
                emoji = "📉"; // Vermelho
            }

            const varianceLabel = `Variação: ${emoji} ${prefix}${pct.toFixed(1)}%`;

            // Retorna um array de strings para que o tooltip mostre duas linhas
            return [mainLabel, varianceLabel];
          },
          // Customiza o título do Tooltip para ser apenas o mês/ano
          title: function(context) {
            const label = context[0].label || '';
            return `${label} / ${ano}`;
          }
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  if (isLoading) return <div className="evolucao-chart-loading">Carregando gráfico...</div>;
  if (isError) return <div className="evolucao-chart-error">Erro ao carregar dados</div>;

  return (
    <div className="evolucao-chart-wrapper">
      <Line data={chartData} options={options} />
    </div>
  );
}