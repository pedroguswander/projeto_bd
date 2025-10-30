import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Função que faz a chamada POST para criar um novo registro de pesquisa.
 * @param {object} novaPesquisa - Objeto com os dados da pesquisa.
 * (fk_usuario_id, email, genero, satisfacao_geral, etc.)
 * @returns {Promise<object>} - A resposta da API.
 */
const inserirPesquisa = async (novaPesquisa) => {
  // O backend deve estar preparado para receber valores nulos
  // para os campos não preenchidos no formulário.
  const { data } = await axios.post('http://localhost:8080/api/pesquisas', novaPesquisa);
  return data;
};

/**
 * Hook customizado para encapsular a mutação de inserir pesquisa.
 */
export const useInserirPesquisa = () => {
  return useMutation({
    mutationFn: inserirPesquisa,
  });
};
