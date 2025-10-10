import React from 'react';
import Navbar from '../components/Navbar'; // Ajuste o caminho conforme sua estrutura de pastas

const Home = () => {
    return (
        <>
            <Navbar />

            <div style={{ paddingTop: '5rem' }}>
                <div className="container">
                    <h1 className="mt-5">Página Inicial</h1>
                    <p className="lead">Bem-vindo ao sistema de streaming. Utilize o menu de navegação acima para gerenciar as entidades do projeto e visualizar as consultas.</p>
                </div>
            </div>
        </>
    );
};

export default Home;