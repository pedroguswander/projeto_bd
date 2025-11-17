import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const inserirGenero = async (novoGenero) => {
    const { data } = await axios.post('http://localhost:8080/api/generos', novoGenero);
    return data;
};

export const useInserirGenero = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: inserirGenero,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generos'] });
        },
    });
};