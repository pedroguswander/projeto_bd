import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Interface para os dados que vêm do backend.
 * @typedef {object} PesquisaProcessadaDTO
 * @property {number} precoIdeal
 * @property {number} qtdAssinaturas
 */

/**
 * Função para buscar os dados processados da API.
 * @returns {Promise<PesquisaProcessadaDTO[]>}
 */
const fetchDadosProcessados = async () => {
  // O endpoint que você definiu no seu Controller Spring
  const endpoint = 'http://localhost:8080/api/pesquisas/qtd-servicos-por-preco-ideal';
  
  try {
    const { data } = await axios.get(endpoint);
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados da pesquisa:", error);

  }
};

/**
 * Hook customizado do React Query para buscar os dados
 * de preço ideal vs. quantidade de assinaturas.
 */
export const useQtdServicosPorPrecoIdeal = () => {
  return useQuery({
    queryKey: ['qtdServicosPorPrecoIdeal'],
    queryFn: fetchDadosProcessados,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });
};