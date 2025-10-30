import { useQuery } from '@tanstack/react-query';

/**
 * Simula uma chamada de API para GET /api/pesquisa
 * Em um app real, você usaria fetch() ou axios() aqui.
 */
const fetchSatisfacaoData = async () => {
    console.log("Buscando dados da API...");

    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Em um caso real, seria algo como:
    const response = await fetch('http://localhost:8080/api/pesquisas/satisfacao-por-genero');
    if (!response.ok) {
        throw new Error('Falha ao buscar dados');
    }
    const data = await response.json();

    return data;
};

/**
 * Hook customizado que usa React Query para buscar os dados de satisfação.
 */
export const useSatisfacao = () => {
    return useQuery({
    queryKey: ['satisfacaoData'], // Chave única para o cache
    queryFn: fetchSatisfacaoData,  // A função que busca os dados
    });
};