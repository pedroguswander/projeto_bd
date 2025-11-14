// src/hooks/useDistribuicaoObras.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchDistribuicaoObrasPorGenero = async () => {
  // Ajuste a URL base conforme o seu ambiente (ex: porta do backend)
  const response = await axios.get('http://localhost:8080/api/obras/distribuicao/genero');
  return response.data;
};

export function useDistribuicaoObras() {
  return useQuery({
    queryKey: ['distribuicaoObrasPorGenero'],
    queryFn: fetchDistribuicaoObrasPorGenero,
    staleTime: 5 * 60 * 1000, // Dados considerados "frescos" por 5 minutos
    cacheTime: 10 * 60 * 1000, // Dados permanecem no cache por 10 minutos
    onError: (error) => {
      console.error("Erro ao buscar distribuição de obras por gênero:", error);
    }
  });
}