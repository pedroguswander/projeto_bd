// src/components/ConsultaObraLike.js

import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const ConsultaObraLike = () => {
    // Estados para gerenciar o componente
    const [termoBusca, setTermoBusca] = useState('');
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(''); // Para mensagens de erro ou "não encontrado"

    // Função assíncrona para lidar com a submissão do formulário
    const handleBuscaSubmit = async (event) => {
        event.preventDefault(); // Previne o recarregamento da página

        if (!termoBusca.trim()) {
            setMensagem('Por favor, insira um termo para a busca.');
            setResultados([]);
            return;
        }

        // Reseta o estado antes de uma nova busca
        setLoading(true);
        setMensagem('');
        setResultados([]);

        try {
            // A URL deve corresponder ao seu endpoint no backend Spring Boot
            const response = await fetch(`/api/obras/buscar?nome=${encodeURIComponent(termoBusca)}`);

            if (!response.ok) {
                // Captura erros de HTTP (ex: 404, 500)
                throw new Error(`Erro na busca: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                setMensagem('Nenhuma obra encontrada com o termo informado.');
            } else {
                setResultados(data);
            }

        } catch (error) {
            console.error("Erro ao realizar o fetch:", error);
            setMensagem(`Erro ao conectar com a API: ${error.message}`);
        } finally {
            // Garante que o estado de 'loading' seja desativado ao final da operação
            setLoading(false);
        }
    };
    
    // Função para renderizar a tabela de resultados
    const renderTabelaResultados = () => {
        if (resultados.length === 0) {
            return null; // Não renderiza nada se não houver resultados
        }

        // Pega os cabeçalhos a partir das chaves do primeiro objeto
        const headers = Object.keys(resultados[0]);

        return (
            <table className="table table-striped table-hover mt-4">
                <thead>
                    <tr>
                        {headers.map(header => (
                            <th key={header}>
                                {header.charAt(0).toUpperCase() + header.slice(1)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {resultados.map((item, index) => (
                        <tr key={item.id || index}> {/* Use uma chave única como 'item.id' se disponível */}
                            {headers.map(header => (
                                <td key={`${item.id}-${header}`}>{item[header]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };


    return (
        <>
        <Navbar />

        <div className="container" style={{ marginTop: '100px' }}>
            <h1 className="mb-4">Busca de Obras por Nome</h1>

            <form onSubmit={handleBuscaSubmit}>
                <div className="mb-3">
                    <label htmlFor="buscaComLike" className="form-label">
                        Insira o nome ou parte do nome da obra:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="buscaComLike"
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        placeholder="Ex: Taxi Driv..."
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            <div className="mt-4">
                {/* Renderização condicional para loading, mensagens e resultados */}
                {loading && <p>Carregando resultados...</p>}
                
                {mensagem && (
                    <div className={mensagem.includes('Erro') ? 'alert alert-danger' : 'alert alert-info'}>
                        {mensagem}
                    </div>
                )}
                
                {renderTabelaResultados()}
            </div>
        </div>
        </>
    );
};

export default ConsultaObraLike;