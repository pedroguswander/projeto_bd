import React from 'react';

// Importe os gráficos necessários
import SatisfacaoChart from './SatisfacaoChart';
import { DistribuicaoHorasSemanaisChart } from './DistribuicaoHorasSemanaisChart';
import GeneroPorAssistidoChart from './GeneroPorAssistidoChart';
import { QtdServicosPorPrecoIdealChart } from './QtdServicosPorPrecoIdealChart';

// Importe o CSS da Home, pois ele contém os estilos dos cards
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

        <div className="dashboard-card card-medium">
          <DistribuicaoHorasSemanaisChart />
        </div>

        <div className="dashboard-card card-medium">
          <QtdServicosPorPrecoIdealChart />
        </div>

        <div className="dashboard-card card-medium">
          <h3>Conteúdo Mais Visto</h3>
          <ul className="top-content-list">
            <li><span>1. A Origem da Matrix</span> <span>1.2M views</span></li>
            <li><span>2. Conexões Perdidas</span> <span>980K views</span></li>
            <li><span>3. O Último Horizonte</span> <span>750K views</span></li>
            <li><span>4. Crônicas de Neon</span> <span>610K views</span></li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default Dashboard;