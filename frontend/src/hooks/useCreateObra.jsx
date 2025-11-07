import { useState } from 'react';
import axios from 'axios'; // Importa o axios diretamente

/**
 * Hook para criar uma nova Obra (POST /obras)
 */
export const useCreateObra = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Executa a criação da obra.
   * @param {object} obraData - O corpo (body) da requisição.
   */
  const createObra = async (obraData) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    
    try {
      // @PostMapping
      // Usa o 'axios.post' diretamente
      const response = await axios.post('http://localhost:8080/api/obras', obraData, {
         headers: { 'Content-Type': 'application/json' }
      });
      setData(response.data);
      return response.data; // Retorna os dados em caso de sucesso
    } catch (err) {
      console.error("Erro ao criar obra:", err);
      setError(err.response?.data?.message || err.message);
      throw err; // Lança o erro para o componente tratar (ex: no .catch)
    } finally {
      setIsLoading(false);
    }
  };

  return { createObra, isLoading, error, data };
};