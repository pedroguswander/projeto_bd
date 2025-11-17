import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const atualizarGenero = async ({ id, generoData }) => {
    const { data } = await axios.put(`http://localhost:8080/api/generos/${id}`, generoData);
    return data;
};

export const useAtualizarGenero = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: atualizarGenero,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generos'] });
        },
    });
};