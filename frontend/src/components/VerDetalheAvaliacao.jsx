import React, { useState } from 'react';
import { useDetalheAvaliacao } from '../hooks/useDetalheAvaliacao';

// Componente para renderizar a tabela de resultados
const TabelaResultados = ({ dados }) => {
    if (dados.length === 0) {
        return <p>Nenhuma avaliação encontrada para este filtro.</p>;
    }

    // Formata a data para um padrão legível
    const formatarData = (dataString) => {
        // Adiciona 'T00:00:00' para garantir que a data seja interpretada corretamente
        // se a string for apenas YYYY-MM-DD, evitando problemas de fuso horário.
        const data = new Date(dataString + 'T00:00:00');
        return data.toLocaleDateString('pt-BR');
    };

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
                <tr style={{ backgroundColor: '#f4f4f4' }}>
                    <th style={styles.th}>Usuário</th>
                    <th style={styles.th}>Obra</th>
                    <th style={styles.th}>Gênero</th>
                    <th style={styles.th}>Nota</th>
                    <th style={styles.th}>Data</th>
                    <th style={styles.th}>Comentário</th>
                </tr>
            </thead>
            <tbody>
                {dados.map((item, index) => (
                    <tr key={index} style={styles.tr}>
                        <td style={styles.td}>{item.nome_usuario}</td>
                        <td style={styles.td}>{item.titulo_obra}</td>
                        <td style={styles.td}>{item.nome_genero}</td>
                        <td style={styles.td}>{item.nota.toFixed(1)}</td>
                        <td style={styles.td}>{formatarData(item.data_avaliacao)}</td>
                        <td style={styles.td}>{item.comentario_avaliacao}</td>
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
        setFiltroAtivo(nomeUsuarioInput); // Define o filtro ativo com o valor do input
        setFoiBuscado(true); // Habilita a execução da query
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Consultar Avaliações de Obras</h2>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="nome_usuario">
                        Filtrar por Nome de Usuário: 
                    </label>
                    <input
                        type="text"
                        id="nome_usuario"
                        value={nomeUsuarioInput}
                        onChange={(e) => setNomeUsuarioInput(e.target.value)}
                        placeholder="Deixe em branco para todos"
                        style={{ marginLeft: '10px', padding: '5px' }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    style={{ padding: '8px 15px', cursor: 'pointer' }}
                >
                    {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            <hr style={{ margin: '20px 0' }} />

            <h3>Resultados da Busca</h3>

            {/* Renderização condicional dos resultados */}
            {isLoading && <p>Carregando dados...</p>}
            
            {isError && (
                <p style={{ color: 'red' }}>
                    Erro ao buscar dados: {error.message}
                </p>
            )}

            {/* Se 'data' existe (busca concluída com sucesso), renderiza a tabela */}
            {data && <TabelaResultados dados={data} />}

            {/* Mensagem inicial antes da primeira busca */}
            {!foiBuscado && !isLoading && <p>Clique em "Buscar" para ver as avaliações.</p>}
        </div>
    );
};

// Estilos simples para a tabela
const styles = {
    th: {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
    },
    td: {
        border: '1px solid #ddd',
        padding: '8px',
    },
    tr: {
        '&:nth-child(even)': {
            backgroundColor: '#f9f9f9'
        }
    }
};

export default VerDetalheAvaliacao;