import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Função que faz a chamada GET para buscar TODAS as contas.
 * Chama o endpoint /api/contas
 */
const buscarContas = async () => {
    const { data } = await axios.get('http://localhost:8080/api/contas');
    return data;
};

/**
 * Hook customizado para buscar a lista de contas.
 */
export const useBuscarContas = () => {
    return useQuery({
        queryKey: ['contas'], // Chave de cache do React Query
        queryFn: buscarContas,
    });
};