// BuscarObrasPorGenero.jsx
import React, { useState } from 'react';
// Importa os hooks do TanStack Query que criamos
import { useObrasPorGenero } from '../hooks/useObrasPorGenero';
import { useBuscarGeneros } from '../hooks/useBuscarGeneros'; 

// Componente principal
const BuscarObrasPorGenero = () => {
    const [generoSelecionado, setGeneroSelecionado] = useState('');

    // 1. Hook para buscar a lista de gêneros para o SELECT
    const { data: generos, isLoading: isLoadingGeneros, isError: isErrorGeneros } = useBuscarGeneros();

    // 2. Hook para buscar as obras com base no gênero SELECIONADO
    const { 
        data: obras, 
        isLoading: isLoadingObras, 
        isError: isErrorObras 
    } = useObrasPorGenero(generoSelecionado); // Passa o estado diretamente

    const handleChange = (event) => {
        setGeneroSelecionado(event.target.value);
    };

    // O componente agora retorna um Fragment (<>) em vez do div principal
    return (
        <React.Fragment> 
            <header style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2>Pesquisar Obra por Gênero</h2>
            </header>
            
            {/* Select Box para Gênero */}
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="genero-select" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Selecione o Gênero:
                </label>
                
                {isErrorGeneros && (
                    <p style={{ color: '#dc3545' }}>Erro ao carregar gêneros.</p>
                )}

                <select
                    id="genero-select"
                    value={generoSelecionado}
                    onChange={handleChange}
                    disabled={isLoadingGeneros || isErrorGeneros}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                    {/* Opção padrão */}
                    <option value="">
                        {isLoadingGeneros ? 'Carregando...' : 'Selecione um Gênero'}
                    </option>
                    
                    {/* Mapeia a lista de gêneros recebida da API */}
                    {(generos ?? []).map((genero) => (
                    <option 
                        key={genero.genero_PK} 
                        value={genero.nome}
                    >
                        {genero.nome}
                    </option>
                ))}
                </select>
            </div>

            {/* Exibição dos Resultados/Status */}
            <div style={{ minHeight: '150px' }}>
                {isLoadingObras && generoSelecionado && (
                    <p style={{ textAlign: 'center', color: '#007bff' }}>
                        **Buscando obras de {generoSelecionado}...**
                    </p>
                )}

                {isErrorObras && (
                    <p style={{ textAlign: 'center', color: '#dc3545' }}>
                        **Erro na busca:** Não foi possível carregar as obras.
                    </p>
                )}

                {!isLoadingObras && !isErrorObras && generoSelecionado && obras.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#6c757d' }}>
                        Nenhuma obra encontrada para o gênero **{generoSelecionado}**.
                    </p>
                )}

                {!isLoadingObras && !isErrorObras && obras.length > 0 && (
                    <>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            Resultados ({obras.length}):
                        </h3>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                            {obras.map((obra, index) => (
                                <li key={index} style={{ marginBottom: '5px' }}>
                                    **{obra}**
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {!generoSelecionado && (
                    <p style={{ textAlign: 'center', color: '#6c757d' }}>
                        Selecione um gênero no menu acima.
                    </p>
                )}
            </div>
        </React.Fragment>
    );
};

export default BuscarObrasPorGenero;