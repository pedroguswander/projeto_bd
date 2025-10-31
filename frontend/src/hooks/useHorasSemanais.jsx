// src/hooks/useHorasSemanais.js

import { useQuery } from '@tanstack/react-query';

/**
 * Busca os dados da distribuição de horas semanais.
 * NOTA: Em um app real, você pode usar 'fetch' ou 'axios'.
 * O endpoint /api/horas-semanais precisa ser configurado
 * (ex: via MSW, Next.js API routes, ou um backend real).
 */
const fetchHorasSemanais = async () => {
  console.log("Buscando dados da API...");
  await new Promise(resolve => setTimeout(resolve, 1000));

  const response = await fetch('http://localhost:8080/api/pesquisas/horas-semanais');
  if (!response.ok) {
     throw new Error('Falha ao buscar dados');
  }
  return await response.json();

};

/**
 * Hook customizado para buscar os dados de horas semanais.
 */
export const useHorasSemanais = () => {
  return useQuery({
    queryKey: ['horasSemanais'], // Chave única para este query
    queryFn: fetchHorasSemanais,  // Função que busca os dados
  });
};