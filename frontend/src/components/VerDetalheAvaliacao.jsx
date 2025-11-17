import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Ícone de lupa
import { useDetalheAvaliacao } from '../hooks/useDetalheAvaliacao';

// Componente para renderizar a tabela de resultados
const TabelaResultados = ({ dados }) => {
    if (dados.length === 0) {
        return <p className="table-empty-message">Nenhuma avaliação encontrada para este filtro.</p>;
    }

    // Formata a data para um padrão legível
    const formatarData = (dataString) => {
        // Adiciona 'T00:00:00' para garantir que a data seja interpretada corretamente
        const data = new Date(dataString + 'T00:00:00');
        if (isNaN(data)) return dataString; 
        return data.toLocaleDateString('pt-BR');
    };

    return (
        <table className="consulta-table">
            <thead>
                <tr>
                    <th className="table-th">Usuário</th>
                    <th className="table-th">Obra</th>
                    <th className="table-th">Gênero</th>
                    <th className="table-th">Nota</th>
                    <th className="table-th">Data</th>
                    <th className="table-th">Comentário</th>
                </tr>
            </thead>
            <tbody>
                {dados.map((item, index) => (
                    <tr key={index} className="table-tr">
                        <td className="table-td">{item.nome_usuario}</td>
                        <td className="table-td">{item.titulo_obra}</td>
                        <td className="table-td">{item.nome_genero}</td>
                        <td className="table-td table-nota">{item.nota.toFixed(1)}</td>
                        <td className="table-td">{formatarData(item.data_avaliacao)}</td>
                        <td className="table-td table-comentario">{item.comentario_avaliacao}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// Componente principal
export const VerDetalheAvaliacao = () => {
    // Estado para o campo de input (controlado)
    const [nomeUsuarioInput, setNomeUsuarioInput] = useState('');
    
    // Estado para o filtro que será *realmente* enviado para a query
    const [filtroAtivo, setFiltroAtivo] = useState('');

    // Estado para controlar se a busca já foi disparada pelo menos uma vez
    const [foiBuscado, setFoiBuscado] = useState(false);

    // Usa o hook customizado
    // A query só será executada (enabled: true) quando 'foiBuscado' for true.
    const { data, isLoading, isError, error } = useDetalheAvaliacao(filtroAtivo, foiBuscado);

    // Função chamada ao submeter o formulário
    const handleSubmit = (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        setFiltroAtivo(nomeUsuarioInput.trim()); // Define o filtro ativo
        setFoiBuscado(true); // Habilita a execução da query
    };

    return (
        <>
            {/* O componente de estilo é adicionado aqui para evitar o erro de 'Module not found' */}
            <style>
                {CSS_STYLES}
            </style>
            
            <div className="avaliacao-container">
                <h1 className="page-title">Consultar Avaliações de Obras</h1>
                
                <div className="search-box-wrapper">
                    <form onSubmit={handleSubmit} className="search-form">
                        
                        {/* Input com estilo de barra de pesquisa unificada */}
                        <input
                            type="text"
                            id="nome_usuario"
                            value={nomeUsuarioInput}
                            onChange={(e) => setNomeUsuarioInput(e.target.value)}
                            placeholder="Filtrar por nome de usuário (ex: Ana Silva)"
                            className="search-input"
                            aria-label="Filtrar por Nome de Usuário"
                        />
                        
                        {/* Botão de Busca como Ícone (Estilo similar ao Analisador de Obras) */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="search-btn"
                        >
                            {isLoading ? <span className="spinner"></span> : <FaSearch size={20} />}
                        </button>
                    </form>
                </div>

                <h3 className="results-header">Resultados da Busca</h3>

                <div className="results-area">
                    {/* O conteúdo abaixo SÓ APARECE se a busca foi disparada (foiBuscado = true) */}
                    
                    {/* 1. Loading */}
                    {isLoading && foiBuscado && (
                        <p className="loading-state">
                            <span className="spinner"></span> Buscando dados de avaliações...
                        </p>
                    )}
                    
                    {/* 2. Erro */}
                    {isError && foiBuscado && (
                        <p className="error-state">
                            Erro ao buscar dados: {error.message}
                        </p>
                    )}

                    {/* 3. Tabela de Resultados */}
                    {data && foiBuscado && !isLoading && !isError && <TabelaResultados dados={data} />}
                    
                </div>
            </div>
        </>
    );
};

export default VerDetalheAvaliacao;


// Estilos CSS em string para injeção
const CSS_STYLES = `
/*
  ==============================================
  Estilos Globais
  ==============================================
*/
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

body {
    background-color: #f7f7f9;
    font-family: 'Inter', sans-serif;
}

.avaliacao-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    text-align: center;
    margin-bottom: 30px;
}

.results-header {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-top: 30px;
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #e5e7eb;
}

/*
  ==============================================
  Estilos da Barra de Pesquisa (Consistência)
  ==============================================
*/
.search-box-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
}

.search-form {
    display: flex;
    max-width: 500px;
    width: 100%;
    gap: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
}

.search-input {
    flex: 1;
    padding: 12px 15px;
    border: none;
    font-size: 1rem;
    outline: none;
    transition: box-shadow 0.2s;
    color: #1f2937;
}

.search-input:focus {
    box-shadow: 0 0 0 2px #6366f1; /* Efeito de anel no foco */
}

.search-btn {
    padding: 0 15px;
    background: #4f46e5; /* Cor primária (Indigo) */
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    min-width: 60px; /* Largura mínima para o botão */
}

.search-btn:hover:not(:disabled) {
    background: #4338ca;
}

.search-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/*
  ==============================================
  Estilos da Tabela de Resultados (Consistência)
  ==============================================
*/
.results-area {
    overflow-x: auto; /* Garante scroll em telas pequenas */
}

.consulta-table {
    min-width: 800px; /* Garante que a tabela tenha um tamanho mínimo */
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    font-size: 0.9rem;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden; 
}

.table-th {
    padding: 12px 10px;
    text-align: left;
    background-color: #eef2ff; /* Fundo levemente azul para o cabeçalho */
    border-bottom: 2px solid #6366f1;
    color: #1f2937;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
}

.table-td {
    padding: 10px;
    border-bottom: 1px solid #f3f4f6;
    color: #4b5563;
    vertical-align: top;
}

/* Estilos específicos para células */
.table-nota {
    font-weight: 700;
    color: #059669; /* Verde para notas */
    text-align: center;
}

.table-comentario {
    /* Limita o tamanho do comentário e usa quebra de linha */
    max-width: 300px;
    white-space: normal;
    word-wrap: break-word;
}

/* Efeito zebrado */
.consulta-table tbody tr:nth-child(even) {
    background-color: #fcfcfc;
}
.consulta-table tbody tr:hover {
    background-color: #f5f5f5;
}


/*
  ==============================================
  Estilos de Mensagens e Loading
  ==============================================
*/
/* Removendo .initial-message, pois não será renderizada */
.loading-state, .table-empty-message {
    padding: 20px;
    text-align: center;
    border-radius: 6px;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    max-width: 600px;
}

.loading-state {
    background-color: #e5e7eb;
    color: #374151;
    font-weight: 500;
}

.error-state {
    padding: 20px;
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
    border-radius: 6px;
    font-weight: 500;
    margin-left: auto;
    margin-right: auto;
    max-width: 600px;
}

.table-empty-message {
    border: 1px dashed #d1d5db;
    color: #6b7280;
}

/* Estilo para o Spinner */
.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #6366f1;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-right: 8px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;