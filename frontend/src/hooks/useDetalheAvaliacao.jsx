import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// A URL base da sua API
const API_URL = 'http://localhost:8080/api/detalhe-avaliacoes';

/**
 * Função que busca os dados na API.
 * Ela será chamada pelo useQuery.
 */
const fetchDetalhes = async (nomeUsuario) => {
    try {
        const response = await axios.get(`${API_URL}/filter`, {
            params: {
                // O axios vai transformar isso em: /filter?nome_usuario=valor
                // Se nomeUsuario for "" ou undefined, o axios pode omiti-lo ou enviar vazio,
                // o que funciona com o `required = false` do seu backend.
                nome_usuario: nomeUsuario 
            }
        });
        // Retorna os dados da resposta (a lista de DetalheAvaliacaoDTO)
        return response.data;
    } catch (error) {
        // Lança o erro para o useQuery capturar
        throw new Error('Falha ao buscar avaliações: ' + (error.response?.data?.message || error.message));
    }
};

/**
 * Hook customizado para buscar os detalhes das avaliações.
 *
 * @param {string} nomeUsuario - O nome do usuário para filtrar (pode ser vazio).
 * @param {boolean} enabled - Flag para controlar se a query deve ser executada.
 */
export const useDetalheAvaliacao = (nomeUsuario, enabled) => {
    return useQuery({
        // 1. queryKey: Chave única para esta query.
        // O React Query usa isso para cache.
        // Inclui 'nomeUsuario' para que a query seja refeita se o filtro mudar.
        queryKey: ['detalhesAvaliacao', nomeUsuario],

        // 2. queryFn: A função que busca os dados.
        queryFn: () => fetchDetalhes(nomeUsuario),

        // 3. enabled: Controla a execução da query.
        // Só vai executar quando 'enabled' for true.
        // Isso impede que a query rode ao carregar a página,
        // esperando o usuário clicar em "Buscar".
        enabled: enabled,
    });
};