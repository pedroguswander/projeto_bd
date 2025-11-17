import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const deletarGenero = async (id) => {
    await axios.delete(`http://localhost:8080/api/generos/${id}`);
};

export const useDeletarGenero = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletarGenero,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generos'] });
        },
    });
};