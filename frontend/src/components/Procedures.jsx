import React from 'react';

// Importe o componente de consulta que criamos anteriormente
import UsuarioStatusConta from './UsuarioStatusConta'; 

// Importe o CSS da Home para usar os estilos de card
import '../pages/Home.css'; 
import { HorasAssistidasPorObra } from './HorasAssistidasPorObra';

function Procedures() {
  return (
    <>
      <h1>Procedures</h1>

      <section className="dashboard-grid">
        {/* Você pode adicionar quantos cards de consulta quiser aqui */}
        
        <div className="dashboard-card card-full-width"> 
          {/* Usei uma classe nova 'card-full-width' para a tabela */}
          <h3>Procedure I</h3>
          <UsuarioStatusConta />
        </div>


        {/* Exemplo de outro card que você poderia adicionar
        <div className="dashboard-card card-medium">
          <h3>Outra Consulta</h3>
          <p>...</p>
        </div>
        */}

      </section>
        <div className="dashboard-card card-full-width"> 
          {/* Usei uma classe nova 'card-full-width' para a tabela */}
          <h3>Procedure II</h3>
          <HorasAssistidasPorObra />
        </div>
    </>
  );
}

export default Procedures;