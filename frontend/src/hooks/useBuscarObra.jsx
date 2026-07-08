import axios from 'axios';
import { 
    useQuery
} from '@tanstack/react-query';

export const useBuscarObra = (nome) => {
  const fetchObra = async ({ queryKey }) => {
    const [, nome] = queryKey;
    if (!nome) return null; // Não fazer fetch se o nome estiver vazio
    
    // O backend espera o nome na URL
    const { data } = await axios.get(`http://localhost:8080/api/obras/buscarNome/${nome}`);
    return data;
  };

  return useQuery({
    queryKey: ['obra', nome],
    queryFn: fetchObra,
    enabled: !!nome, // Só executa se 'nome' não for nulo ou vazio
    retry: false, // Não tentar de novo em erro 404 (Not Found)
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Cache de 5 minutos
  });
};
