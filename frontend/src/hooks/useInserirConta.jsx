import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Função que faz a chamada POST para criar uma nova conta.
 */
const inserirConta = async (novaConta) => {
    const { data } = await axios.post('http://localhost:8080/api/contas', novaConta);
    return data;
};

/**
 * Hook customizado para encapsular a mutação de inserir conta.
 */
export const useInserirConta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: inserirConta,
        onSuccess: () => {
            // Invalida a query 'contas' para forçar a recarga da lista
            queryClient.invalidateQueries({ queryKey: ['contas'] });
        },
    });
};