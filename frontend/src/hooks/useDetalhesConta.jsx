import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/*
 * ==================================================================
 * HOOK 1: Buscar Detalhes das Contas
 * ==================================================================
 */

const fetchDetalhesContas = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simula atraso de rede

   const { data } = await axios.get('http://localhost:8080/api/contas/detalhes-usuario-conta')
   return data; // Retorna uma cópia dos dados mocados
};

export const useDetalhesContas = () => {
  return useQuery({
    queryKey: ['detalhesContas'], // Chave de cache do React Query
    queryFn: () => fetchDetalhesContas(), // Função que busca os dados
  });
};