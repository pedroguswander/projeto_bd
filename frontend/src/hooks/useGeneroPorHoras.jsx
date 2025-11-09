import { useQuery } from '@tanstack/react-query';

const fetchGeneroPorHorasData = async () => {
    console.log("Buscando dados da API de Gênero por Horas Semanais...");

    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch('http://localhost:8080/api/pesquisas/genero-por-horas');
    if (!response.ok) {
        throw new Error('Falha ao buscar dados');
    }
    const data = await response.json();
    return data;
};

export const useGeneroPorHoras = () => {
    return useQuery({
        queryKey: ['generoPorHoras'],
        queryFn: fetchGeneroPorHorasData,
    });
};