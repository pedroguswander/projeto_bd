import React, { useState } from 'react';
import './InserirUsuarioPesquisa.css';
import { FaTimes } from 'react-icons/fa';
// Importando os hooks de mutação
import { useInserirUsuarioPesquisa } from '../hooks/useInserirUsuarioPesquisa'; // Assumindo que o primeiro arquivo está em './useInserirUsuario'
import { useInserirPesquisa } from '../hooks/useInserirPesquisa'; // Assumindo que o segundo arquivo está em './useInserirPesquisa'

function InserirUsuarioPesquisa({ onClose }) {
  // Hooks de mutação
  const mutacaoUsuario = useInserirUsuarioPesquisa();
  const mutacaoPesquisa = useInserirPesquisa();

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    rua: '',
    bairro: '',
    numero: '',
    genero: '', // Campo extra para a pesquisa
    satisfacao: '', // Campo extra para a pesquisa
  });

  // Manipulador de mudança para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para parar a propagação ao clicar no conteúdo do modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // Função para lidar com o submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Coletar dados para a tabela 'usuario'
    const dadosUsuario = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      rua: formData.rua,
      bairro: formData.bairro,
      // O número pode ser uma string ou number, dependendo da sua API.
      // Vou converter para número se for um valor preenchido, se não, envio a string vazia/null que a API espera.
      numero: formData.numero ? Number(formData.numero) : null,
    };

    try {
      // **Chama useInserirUsuario**
      const usuarioCriado = await mutacaoUsuario.mutateAsync(dadosUsuario);

      console.log('Usuário criado:', usuarioCriado);

      // O ID do usuário criado deve ser retornado pelo backend (ex: { id: 123, ... })
      // Se a sua API retorna o ID em 'id', use 'usuarioCriado.id'.
      // Se a sua API retorna o ID em 'fk_usuario_id', ajuste conforme a resposta real.
      // Vou assumir que o ID está diretamente em 'usuarioCriado' e é chamado de 'id'.
      const usuarioId = usuarioCriado.usuarioId; // <--- PONTO CRUCIAL: Pegar o ID do usuário criado

      if (!usuarioId) {
          throw new Error("ID do usuário não foi retornado após a criação.");
      }

      // 2. Coletar dados para a tabela 'pesquisa'
      const dadosPesquisa = {
        fk_usuario_id: usuarioId, // ID do usuário que acabamos de criar
        email: formData.email,
        genero: formData.genero || null,
        // Converte a satisfação para número ou envia null/undefined
        satisfacao_geral: formData.satisfacao ? Number(formData.satisfacao) : null,
        // ... outros campos que a tabela 'pesquisa' possa exigir
      };

      // **Chama useInserirPesquisa**
      await mutacaoPesquisa.mutateAsync(dadosPesquisa);

      // Sucesso total
      console.log('Usuário e Pesquisa inseridos com sucesso!');
      onClose(); // Fecha o modal após o sucesso

    } catch (error) {
      // Tratar erros de qualquer uma das mutações
      console.error('Erro ao inserir Usuário ou Pesquisa:', error);
      alert('Ocorreu um erro ao salvar os dados. Verifique o console para mais detalhes.');
    }
  };

  const isSaving = mutacaoUsuario.isPending || mutacaoPesquisa.isPending;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <header className="modal-header">
          <h2>Adicionar Novo Usuário e Pesquisa</h2>
          <button onClick={onClose} className="modal-close-btn" disabled={isSaving}>
            <FaTimes />
          </button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit}>
          
          <div className="modal-form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input 
              type="text" 
              id="nome" 
              name="nome" 
              value={formData.nome} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="modal-form-group">
            <label>Gênero</label>
            <div className="modal-radio-group">
              <label>
                <input 
                  type="radio" 
                  name="genero" 
                  value="Masculino" 
                  checked={formData.genero === 'Masculino'}
                  onChange={handleChange}
                /> Masculino
              </label>
              <label>
                <input 
                  type="radio" 
                  name="genero" 
                  value="Feminino" 
                  checked={formData.genero === 'Feminino'}
                  onChange={handleChange}
                /> Feminino
              </label>
            </div>
          </div>

          <div className="modal-form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="senha">Senha</label>
            <input 
              type="password" 
              id="senha" 
              name="senha" 
              value={formData.senha} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Grid para Endereço */}
          <div className="modal-address-grid">
            <div className="modal-form-group">
              <label htmlFor="rua">Rua</label>
              <input 
                type="text" 
                id="rua" 
                name="rua" 
                value={formData.rua} 
                onChange={handleChange} 
              />
            </div>
            <div className="modal-form-group">
              <label htmlFor="bairro">Bairro</label>
              <input 
                type="text" 
                id="bairro" 
                name="bairro" 
                value={formData.bairro} 
                onChange={handleChange} 
              />
            </div>
            <div className="modal-form-group">
              <label htmlFor="numero">Número</label>
              <input 
                type="number" 
                id="numero" 
                name="numero" 
                value={formData.numero} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="modal-form-group">
            <label htmlFor="satisfacao">Nível de Satisfação (1-5)</label>
            <input 
              type="number" 
              id="satisfacao" 
              name="satisfacao" 
              min="1" 
              max="5" 
              value={formData.satisfacao} 
              onChange={handleChange} 
            />
          </div>

          {/* Indicador de Carregamento/Erro */}
          {(mutacaoUsuario.isPending || mutacaoPesquisa.isPending) && (
            <p className="modal-status-message">Salvando dados...</p>
          )}
          {mutacaoUsuario.isError && (
            <p className="modal-error-message">Erro ao criar usuário: {mutacaoUsuario.error.message}</p>
          )}
          {mutacaoPesquisa.isError && (
            <p className="modal-error-message">Erro ao salvar pesquisa: {mutacaoPesquisa.error.message}</p>
          )}

          {/* Botões do Rodapé */}
          <footer className="modal-footer">
            <button 
              type="button" 
              className="modal-btn modal-btn-secondary" 
              onClick={onClose} 
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="modal-btn modal-btn-primary" 
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </footer>

        </form>
      </div>
    </div>
  );
}

export default InserirUsuarioPesquisa;