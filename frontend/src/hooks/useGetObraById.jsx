import { useState } from 'react';
import axios from 'axios'; // Importa o axios diretamente

/**
 * Hook para buscar uma Obra pelo código (GET /obras/{codigo})
 */
export const useGetObraById = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Executa a busca da obra.
   * @param {number | string} codigo - O ID da obra.
   */
  const getObra = async (codigo) => {
    if (!codigo) {
      setError(new Error("Código (ID) é obrigatório."));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setData(null);
    
    try {
      // @GetMapping("/{codigo}")
      // Usa o 'axios.get' diretamente
      const response = await axios.get(`http://localhost:8080/api/obras/${codigo}`);
      setData(response.data);
      return response.data; // Retorna os dados em caso de sucesso
    } catch (err) {
      console.error(`Erro ao buscar obra ${codigo}:`, err);
      if (err.response && err.response.status === 404) {
         setError(new Error("Obra não encontrada."));
      } else {
        setError(err.response?.data?.message || err.message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { getObra, isLoading, error, data };
};