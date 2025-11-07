import { useState } from 'react';
import axios from 'axios'; // Importa o axios diretamente

/**
 * Hook para atualizar uma Obra (PUT /obras/{codigo})
 */
export const useUpdateObra = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Executa a atualização da obra.
   * @param {number | string} codigo - O ID da obra.
   * @param {object} obraData - O corpo (body) da requisição.
   */
  const updateObra = async (codigo, obraData) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    
    try {
      // @PutMapping("/{codigo}")
      // Usa o 'axios.put' diretamente
      const response = await axios.put(`http://localhost:8080/api/obras/${codigo}`, obraData, {
         headers: { 'Content-Type': 'application/json' }
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error(`Erro ao atualizar obra ${codigo}:`, err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateObra, isLoading, error, data };
};