import React from 'react';

// Importe o componente de consulta que criamos anteriormente
import VerDetalheAvaliacao from './VerDetalheAvaliacao'; 

// Importe o CSS da Home para usar os estilos de card
import '../pages/Home.css'; 

function Views() {
  return (
    <>
      <h1>Views</h1>

      <section className="dashboard-grid">
        {/* Você pode adicionar quantos cards de consulta quiser aqui */}
        
        <div className="dashboard-card card-full-width"> 
          {/* Usei uma classe nova 'card-full-width' para a tabela */}
          <h3>View I</h3>
          <VerDetalheAvaliacao />
        </div>

        {/* Exemplo de outro card que você poderia adicionar
        <div className="dashboard-card card-medium">
          <h3>Outra Consulta</h3>
          <p>...</p>
        </div>
        */}

      </section>
    </>
  );
}

export default Views;