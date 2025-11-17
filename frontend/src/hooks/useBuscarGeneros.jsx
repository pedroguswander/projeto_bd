import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const buscarGeneros = async () => {
    const { data } = await axios.get('http://localhost:8080/api/generos');
    return data;
};

export const useBuscarGeneros = () => {
    return useQuery({
        queryKey: ['generos'],
        queryFn: buscarGeneros,
    });
};