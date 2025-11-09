import { useQuery } from '@tanstack/react-query';

const fetchDispositivosPorGeneroData = async () => {
    console.log("Buscando dados da API de Dispositivos por Gênero Assistido...");

    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch('http://localhost:8080/api/pesquisas/dispositivos-por-genero');
    if (!response.ok) {
        throw new Error('Falha ao buscar dados');
    }
    const data = await response.json();
    return data;
};

export const useDispositivosPorGenero = () => {
    return useQuery({
        queryKey: ['dispositivosPorGenero'],
        queryFn: fetchDispositivosPorGeneroData,
    });
};