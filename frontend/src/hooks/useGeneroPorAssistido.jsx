import { useQuery } from '@tanstack/react-query';

const fetchGeneroPorAssistidoData = async () => {
    console.log("Buscando dados da API de Gênero por Assistido...");

    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch('http://localhost:8080/api/pesquisas/genero-por-assistido');
    if (!response.ok) {
        throw new Error('Falha ao buscar dados');
    }
    const data = await response.json();
    return data;
};

export const useGeneroPorAssistido = () => {
    return useQuery({
        queryKey: ['generoPorAssistido'],
        queryFn: fetchGeneroPorAssistidoData,
    });
};
