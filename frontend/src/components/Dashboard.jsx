import React from 'react';

import SatisfacaoChart from './SatisfacaoChart';
import { DistribuicaoHorasSemanaisChart } from './DistribuicaoHorasSemanaisChart';
import GeneroPorAssistidoChart from './GeneroPorAssistidoChart';
import { QtdServicosPorPrecoIdealChart } from './QtdServicosPorPrecoIdealChart';
import { GeneroPorHorasChart } from './GeneroPorHorasChart'; 

import { useTotaisPorGenero } from '../hooks/useTotalPorGenero';

import '../pages/Home.css'; 

function Dashboard() {


  return (
    <>
      <h1>Dashboard</h1>

      <section className="dashboard-grid">
        <div className="dashboard-card card-medium">
          <SatisfacaoChart />
        </div>

        <div className="dashboard-card card-large">
          <GeneroPorAssistidoChart />
        </div>

        <div className="dashboard-card card-large"> 
          <GeneroPorHorasChart />
        </div>
        
        <div className="dashboard-card card-medium">
          <DistribuicaoHorasSemanaisChart />
        </div>

        <div className="dashboard-card card-medium">
          <QtdServicosPorPrecoIdealChart />
        </div>
        
      </section>
    </>
  );
}

export default Dashboard;