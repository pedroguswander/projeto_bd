import React from 'react';

// Importe o componente de consulta que criamos anteriormente
import VerDetalheAvaliacao from './VerDetalheAvaliacao'; 

import EvolucaoNovasContas from '../components/EvolucaoNovasContas';

import DistribuicaoObrasPorGeneroChart from "./chart/DistribuicaoObrasPorGeneroChart";

// Importe o CSS da Home para usar os estilos de card
import '../pages/Home.css'; 
import { MediaNotasObras} from './MediaNotasObras';

function PowerBI() {
  return (
    <>
      <h1>Power BI</h1>

      <section className="dashboard-grid">
        {/* Você pode adicionar quantos cards de consulta quiser aqui */}
        
        <div className="dashboard-card card-large"> 
          {/* Usei uma classe nova 'card-full-width' para a tabela */}
          <EvolucaoNovasContas />
        </div>

        
        <DistribuicaoObrasPorGeneroChart />


      </section>
    </>
  );
}

export default PowerBI;