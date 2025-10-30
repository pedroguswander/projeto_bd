import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Função que faz a chamada POST para criar um novo usuário.
 * @param {object} novoUsuario - Objeto com os dados do usuário (nome, email, senha, rua, bairro, numero)
 * @returns {Promise<object>} - A resposta da API (espera-se que contenha o usuário criado com seu ID)
 */
const inserirUsuario = async (novoUsuario) => {
  // O backend DEVE retornar o usuário criado, incluindo o ID,
  // para que possamos usá-lo na próxima chamada.
  const { data } = await axios.post('http://localhost:8080/api/usuarios', novoUsuario);
  return data;
};

/**
 * Hook customizado para encapsular a mutação de inserir usuário.
 */
export const useInserirUsuario = () => {
  return useMutation({
    mutationFn: inserirUsuario,
    // Você pode adicionar onSuccess, onError, onSettled aqui se necessário
  });
};
