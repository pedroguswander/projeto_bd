import { useState } from 'react';
import axios from 'axios'; // Importa o axios diretamente

/**
 * Hook para criar uma nova Obra (POST /obras)
 */
export const useCreateObra = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // O erro será uma string (a mensagem do backend)
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
      const response = await axios.post('http://localhost:8080/api/obras', obraData, {
          headers: { 'Content-Type': 'application/json' }
      });
      setData(response.data);
      return response.data; 
    } catch (err) {
      console.error("Erro ao criar obra:", err);
      
      let errorMessage = "Ocorreu um erro desconhecido.";

      if (axios.isAxiosError(err) && err.response) {
        const responseData = err.response.data;
        
        // --- AJUSTE CRUCIAL: Captura a string de erro do backend ---
        if (typeof responseData === 'string' && responseData.length > 0) {
          // Captura a mensagem "ERRO: Nao e permitido inserir obras com nomes duplicados."
          errorMessage = responseData;
        } else if (responseData && responseData.message) {
          // Fallback para erros JSON padronizados (se o Spring retornar { message: "..." })
          errorMessage = responseData.message;
        } else {
          // Mensagem padrão para status de erro (4xx/5xx)
          errorMessage = `Erro (${err.response.status}): Falha na requisição.`;
        }

      } else {
        // Erros de rede (sem resposta do servidor)
        errorMessage = err.message || "Erro de conexão com o servidor.";
      }

      // Define a mensagem de erro simples no estado do hook
      setError(errorMessage); 
      
      // Lança um erro com a mensagem limpa para que o componente a utilize no bloco `catch` (opcionalmente)
      throw new Error(errorMessage); 
    } finally {
      setIsLoading(false);
    }
  };

  return { createObra, isLoading, error, data };
};