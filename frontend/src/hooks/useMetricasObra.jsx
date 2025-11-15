import axios from 'axios';
import { 
    useQuery
} from '@tanstack/react-query'; 

export const useMetricasObra = (codigoObra) => {
  const fetchMetricas = async ({ queryKey }) => {
    const [, codigoObra] = queryKey;
    if (!codigoObra) return null; // Não fazer fetch se o código não existir
    
    const { data } = await axios.get(`http://localhost:8080/api/obras/${codigoObra}/metricas`);
    return data;
  };

  return useQuery({
    queryKey: ['metricas', codigoObra],
    queryFn: fetchMetricas,
    enabled: !!codigoObra, // Só executa se 'codigoObra' for válido
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

