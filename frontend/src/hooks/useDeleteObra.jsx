import { useState } from 'react';
import axios from 'axios'; // Importa o axios diretamente

/**
 * Hook para deletar uma Obra (DELETE /obras/{codigo})
 */
export const useDeleteObra = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Executa a deleção da obra.
   * @param {number | string} codigo - O ID da obra.
   */
  const deleteObra = async (codigo) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // @DeleteMapping("/{codigo}")
      // Usa o 'axios.delete' diretamente
      await axios.delete(`http://localhost:8080/api/obras/${codigo}`);
      // Sucesso (204 No Content)
    } catch (err) {
      console.error(`Erro ao deletar obra ${codigo}:`, err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteObra, isLoading, error };
};