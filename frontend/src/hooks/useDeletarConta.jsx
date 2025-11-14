import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Função que faz a chamada DELETE para deletar uma conta.
 */
const deletarConta = async (id) => {
    await axios.delete(`http://localhost:8080/api/contas/${id}`);
};

/**
 * Hook customizado para encapsular a mutação de deletar conta.
 */
export const useDeletarConta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletarConta,
        onSuccess: () => {
            // Invalida a query 'contas' para forçar a recarga
            queryClient.invalidateQueries({ queryKey: ['contas'] });
        },
    });
};