import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Função que faz a chamada PUT para atualizar uma conta.
 */
const atualizarConta = async ({ id, contaData }) => {
    const { data } = await axios.put(`http://localhost:8080/api/contas/${id}`, contaData);
    return data;
};

/**
 * Hook customizado para encapsular a mutação de atualizar conta.
 */
export const useAtualizarConta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: atualizarConta,
        onSuccess: () => {
            // Invalida a query 'contas' para forçar a recarga
            queryClient.invalidateQueries({ queryKey: ['contas'] });
        },
    });
};