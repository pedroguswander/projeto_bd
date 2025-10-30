import React, { useState } from 'react';
// As importações de react-query e axios são assumidas como disponíveis no ambiente
import { useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios'; // Assumido como disponível

// --- Configuração do React Query Client ---
const queryClient = new QueryClient();

// --- Definições dos Hooks (movidas para este arquivo) ---

/**
 * Função que faz a chamada POST para criar um novo usuário.
 * @param {object} novoUsuario - Objeto com os dados do usuário
 * @returns {Promise<object>} - A resposta da API (espera-se que contenha o usuário criado com seu ID)
 */
const inserirUsuario = async (novoUsuario) => {
  // O backend DEVE retornar o usuário criado, incluindo o ID.
  const { data } = await axios.post('/api/usuarios', novoUsuario);
  return data;
};

/**
 * Hook customizado para encapsular a mutação de inserir usuário.
 */
const useInserirUsuario = () => {
  return useMutation({
    mutationFn: inserirUsuario,
  });
};

/**
 * Função que faz a chamada POST para criar um novo registro de pesquisa.
 * @param {object} novaPesquisa - Objeto com os dados da pesquisa.
 * @returns {Promise<object>} - A resposta da API.
 */
const inserirPesquisa = async (novaPesquisa) => {
  const { data } = await axios.post('/api/pesquisas', novaPesquisa);
  return data;
};

/**
 * Hook customizado para encapsular a mutação de inserir pesquisa.
 */
const useInserirPesquisa = () => {
  return useMutation({
    mutationFn: inserirPesquisa,
  });
};

// --- Ícone SVG (substituindo react-icons/fa) ---
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Componente do Modal InserirUsuario ---
// Estilizado com Tailwind CSS (substituindo InserirUsuario.css)
function InserirUsuario({ onClose }) {
  // Estado para controlar todos os campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    genero: '',
    email: '',
    senha: '',
    rua: '',
    bairro: '',
    numero: '',
    satisfacao: '', // Será mapeado para 'satisfacao_geral'
  });

  // Instanciando os hooks de mutação
  const { 
    mutate: criarUsuario, 
    isPending: isCreatingUser, 
    isError: isUserError, 
    error: userError 
  } = useInserirUsuario();
  
  const { 
    mutate: criarPesquisa, 
    isPending: isCreatingPesquisa, 
    isError: isPesquisaError, 
    error: pesquisaError 
  } = useInserirPesquisa();

  // Handler unificado para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para parar a propagação ao clicar no conteúdo do modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // Função para lidar com o submit do formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    const { nome, email, senha, rua, bairro, numero, genero, satisfacao } = formData;

    // 1. Preparar dados do usuário
    const dadosUsuario = {
      nome,
      email,
      senha,
      rua: rua || null,
      bairro: bairro || null,
      numero: numero ? parseInt(numero, 10) : null,
    };

    // 2. Chamar a mutação para criar o usuário
    criarUsuario(dadosUsuario, {
      onSuccess: (usuarioCriado) => {
        // 3. Sucesso!
        console.log('Usuário criado:', usuarioCriado);

        // PONTO CRÍTICO: Ajuste 'usuarioCriado.id' conforme a resposta REAL da sua API
        const fk_usuario_id = usuarioCriado.id; 

        if (!fk_usuario_id) {
          console.error("Erro fatal: A API de criação de usuário não retornou um 'id'.");
          // Você pode querer setar um estado de erro aqui
          return;
        }

        // 4. Preparar dados da pesquisa
        const dadosPesquisa = {
          fk_usuario_id: fk_usuario_id,
          email: email,
          genero: genero || null,
          satisfacao_geral: satisfacao ? parseInt(satisfacao, 10) : null,
          // O backend deve tratar os outros campos como nulos
        };

        // 5. Chamar a mutação para criar a pesquisa
        criarPesquisa(dadosPesquisa, {
          onSuccess: () => {
            console.log('Usuário e Pesquisa criados com sucesso!');
            setFormData({
                nome: '', genero: '', email: '', senha: '',
                rua: '', bairro: '', numero: '', satisfacao: '',
            });
            onClose(); 
          },
          onError: (err) => {
            console.error('Erro ao criar pesquisa:', err);
          }
        });
      },
      onError: (err) => {
        console.error('Erro ao criar usuário:', err);
      }
    });
  };

  const isPending = isCreatingUser || isCreatingPesquisa;

  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up" 
        onClick={handleModalContentClick}
        // Adicionando uma pequena animação de entrada
        style={{animation: 'fadeInUp 0.3s ease-out forwards'}}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Adicionar Novo Usuário</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
            disabled={isPending}
          >
            <CloseIcon />
          </button>
        </header>

        {/* Form */}
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          
          <div className="flex flex-col">
            <label htmlFor="nome" className="mb-1 text-sm font-medium text-gray-700">Nome Completo</label>
            <input 
              type="text" id="nome" name="nome" required 
              value={formData.nome} onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Gênero</label>
            <div className="flex items-center space-x-4 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" name="genero" value="masculino" 
                  checked={formData.genero === 'masculino'} onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                /> 
                <span className="text-gray-700">Masculino</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" name="genero" value="feminino" 
                  checked={formData.genero === 'feminino'} onChange={handleChange}
                  className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                /> 
                <span className="text-gray-700">Feminino</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" id="email" name="email" required 
              value={formData.email} onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="senha" className="mb-1 text-sm font-medium text-gray-700">Senha</label>
            <input 
              type="password" id="senha" name="senha" required 
              value={formData.senha} onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="rua" className="mb-1 text-sm font-medium text-gray-700">Rua</label>
              <input 
                type="text" id="rua" name="rua" 
                value={formData.rua} onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="bairro" className="mb-1 text-sm font-medium text-gray-700">Bairro</label>
              <input 
                type="text" id="bairro" name="bairro"
                value={formData.bairro} onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="numero" className="mb-1 text-sm font-medium text-gray-700">Número</label>
              <input 
                type="number" id="numero" name="numero" 
                value={formData.numero} onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="satisfacao" className="mb-1 text-sm font-medium text-gray-700">Nível de Satisfação (1-5)</label>
            <input 
              type="number" id="satisfacao" name="satisfacao" min="1" max="5" 
              value={formData.satisfacao} onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Feedback de Carregamento e Erro */}
          <div className="min-h-[1.5em] mt-2">
            {isPending && (
              <div className="text-blue-600 text-sm font-medium">
                Salvando... Por favor, aguarde.
              </div>
            )}
            {isUserError && (
              <div className="text-red-600 text-sm font-medium">
                Erro ao criar usuário: {userError?.response?.data?.message || userError?.message || 'Erro desconhecido.'}
              </div>
            )}
            {isPesquisaError && (
               <div className="text-red-600 text-sm font-medium">
                Erro ao salvar pesquisa: {pesquisaError?.response?.data?.message || pesquisaError?.message || 'Erro desconhecido.'}
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-blue-400"
              disabled={isPending}
            >
              {isPending ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </footer>

        </form>
      </div>
      {/* CSS para a animação de entrada */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// --- Componente Principal App ---
// Este componente 'App' agora é o export padrão e gerencia o estado do modal.
export default InserirUsuario;

