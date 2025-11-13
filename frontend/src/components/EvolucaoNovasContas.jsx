import React, { useState } from "react";
import EvolucaoNovasContasChart from "./chart/EvolucaoNovasContasChart";
import "./EvolucaoNovasContas.css";
import useEvolucaoNovasContas from "../hooks/useEvolucaoNovasContas";

export default function EvolucaoNovasContas({ defaultYear = 2024 }) {
  const [year, setYear] = useState(defaultYear);

  // Cria lista dinâmica de anos: mostra defaultYear e os 5 anos anteriores
  const years = Array.from({ length: 7 }, (_, i) => defaultYear - (5 - i));

  // Usa o hook para obter dados e totais
  const { data, isLoading, isError } = useEvolucaoNovasContas(year);

  const counts = data?.countsByMonth ? data.countsByMonth.map((d) => d.quantidade) : [];
  const yearTotal = data?.yearTotal ?? 0;
  const previousYearTotal = data?.previousYearTotal ?? 0;

  // calcula percentual de desempenho ano a ano
  const yearPct = previousYearTotal === 0 ? null : ((yearTotal - previousYearTotal) / previousYearTotal) * 100;

  return (
    <>
    <h1>Power BI</h1>

      <div className="evolucao-container">
      <div className="evolucao-topbar">
        <div className="performance-card">
          <div className="performance-title">Novas Contas</div>
          <div className="performance-value-row">
            <div className="performance-value">{yearTotal}</div>
            <div className={`performance-pct ${yearPct == null ? "neutral" : yearPct >= 0 ? "up" : "down"}`}>
              {yearPct == null ? "—" : `${yearPct >= 0 ? "+" : ""}${yearPct.toFixed(0)}%`}
            </div>
          </div>
          <div className="performance-sub">Comparado ao ano anterior</div>
        </div>
      </div>
        <div className="evolucao-header">
          <h3>Evolução de Novas Contas</h3>
          <div className="evolucao-years">
            {years.map((y) => (
              <button
                key={y}
                className={`evolucao-year-btn ${y === year ? "active" : ""}`}
                onClick={() => setYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="evolucao-chart">
          <EvolucaoNovasContasChart ano={year} />
        </div>
      </div>
    </>
  );
}
