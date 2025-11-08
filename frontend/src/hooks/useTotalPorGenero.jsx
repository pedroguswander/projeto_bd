import { useQuery } from '@tanstack/react-query';

const fetchTotaisPorGenero = async () => {
    console.log("Buscando totais por gênero...");

    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch('http://localhost:8080/api/pesquisas/totais-por-genero');
    if (!response.ok) {
        throw new Error('Falha ao buscar os totais por gênero');
    }

    const data = await response.json();
    return data;
};

export const useTotaisPorGenero = () => {
    return useQuery({
        queryKey: ['totaisPorGenero'],
        queryFn: fetchTotaisPorGenero,
    });
};
