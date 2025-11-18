// useObrasPorGenero.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchObrasPorGenero = async (genero) => {
    // Evita a chamada se o gênero for nulo ou vazio
    if (!genero) {
        return [];
    }
    
    // Endpoint do backend: /por-genero?nome={genero}
    const url = `http://localhost:8080/api/obras/por-genero`;
    
    const { data } = await axios.get(url, {
        params: {
            nome: genero,
        },
    });
    
    // O backend retorna um array de strings (ex: ["Stranger Things", "Cidade de Deus"])
    return data; 
};

/**
 * Hook customizado para buscar obras por gênero usando TanStack Query.
 * @param {string} genero - O gênero a ser buscado.
 */
export const useObrasPorGenero = (genero) => {
    return useQuery({
        // A queryKey inclui o gênero, o que faz com que a query seja refeita
        // automaticamente quando o gênero mudar.
        queryKey: ['obras', genero],
        queryFn: () => fetchObrasPorGenero(genero),
        // A query só é habilitada se um gênero válido for fornecido.
        enabled: !!genero, 
        // Define o estado inicial como um array vazio, se não estiver habilitada
        initialData: [],
    });
};