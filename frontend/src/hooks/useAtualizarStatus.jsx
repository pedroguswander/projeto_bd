import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/*
 * ==================================================================
 * HOOK 2: Atualizar Status da Conta
 * ==================================================================
 */
const updateStatusConta = async ({ usuarioId, novoStatus }) => {
  console.log(`Simulando: PUT /usuario/${usuarioId}/status`, { novoStatus });
  await new Promise((resolve) => setTimeout(resolve, 700)); // Simula atraso de rede

  await axios.put(`http://localhost:8080/api/contas/usuario/${usuarioId}/status`, { novoStatus });
  
  return;
};

export const useAtualizarStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatusConta, // Função que envia a atualização
    onSuccess: () => {
      // Quando a mutação for bem-sucedida, invalide o cache de 'detalhesContas'.
      // Isso fará com que o React Query busque os dados novamente automaticamente.
      console.log('Status atualizado! Invalidando cache...');
      queryClient.invalidateQueries({ queryKey: ['detalhesContas'] });
    },
    onError: (error) => {
      // Adicionar tratamento de erro (ex: exibir um toast)
      console.error('Falha ao atualizar status:', error);
    },
  });
};