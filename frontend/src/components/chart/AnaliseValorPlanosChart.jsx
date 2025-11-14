import React from "react";

import { PolarArea } from "react-chartjs-2";

import {

  Chart as ChartJS,

  ArcElement,

  Tooltip,

  Legend,

  RadialLinearScale,

} from "chart.js";

import useAnaliseValorPlanos from "../../hooks/useAnaliseValorPlanos";

import "./AnaliseValorPlanosChart.css";



ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale);



function buildPalette(n) {

  const base = [

    "#4f46e5",

    "#06b6d4",

    "#f59e0b",

    "#ef4444",

    "#10b981",

    "#8b5cf6",

    "#f97316",

    "#0ea5a4",

  ];

  const out = [];

  for (let i = 0; i < n; i++) out.push(base[i % base.length]);

  return out;

}



export default function AnaliseValorPlanosChart() {

  const { data, isLoading, isError } = useAnaliseValorPlanos();



  if (isLoading) return <div className="analise-loading">Carregando...</div>;

  if (isError) return <div className="analise-error">Erro ao carregar análise de valor</div>;



  const labels = data.map((d) => d.categoria);

  const values = data.map((d) => d.valor);

  const colors = buildPalette(values.length);



  const chartData = {

    labels,

    datasets: [

      {

        data: values,

        backgroundColor: colors.map((c) => `${c}33`), // add alpha

        borderColor: colors,

        borderWidth: 1,

      },

    ],

  };



  const options = {

    responsive: true,

    plugins: {

      legend: { position: "right" },

      tooltip: {

        callbacks: {

          label: function (context) {

            const label = context.label || "";

            const value = context.parsed || 0;

            return `${label}: ${value}`;

          },

        },

      },

    },

    scales: {

      r: {

        ticks: { display: true },

        beginAtZero: true,

      },

    },

  };



  return (

    <div className="analise-polar-wrapper">

      <PolarArea data={chartData} options={options} />

    </div>

  );

}