import React from 'react';
import './InserirUsuario.css'; // Importaremos os estilos que criaremos a seguir
import { FaTimes } from 'react-icons/fa';

// O componente recebe uma prop 'onClose' (uma função para fechá-lo)
function InserirUsuario({ onClose }) {

  // Função para parar a propagação ao clicar no conteúdo do modal,
  // evitando que o modal feche ao clicar dentro dele.
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // Função para lidar com o submit do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar os dados do formulário...
    console.log("Formulário enviado!");
    onClose(); // Fecha o modal após o envio
  };

  return (
    // 1. O Fundo Escuro (Backdrop)
    // Clicar no backdrop (fundo) chamará a função 'onClose'
    <div className="modal-backdrop" onClick={onClose}>
      
      {/* 2. O Conteúdo do Modal */}
      <div className="modal-content" onClick={handleModalContentClick}>
        
        {/* Cabeçalho do Modal */}
        <header className="modal-header">
          <h2>Adicionar Novo Usuário</h2>
          <button onClick={onClose} className="modal-close-btn">
            <FaTimes />
          </button>
        </header>

        {/* Corpo do Modal (Formulário) */}
        <form className="modal-form" onSubmit={handleSubmit}>
          
          <div className="modal-form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" name="nome" required />
          </div>

          <div className="modal-form-group">
            <label>Gênero</label>
            <div className="modal-radio-group">
              <label>
                <input type="radio" name="genero" value="masculino" /> Masculino
              </label>
              <label>
                <input type="radio" name="genero" value="feminino" /> Feminino
              </label>
            </div>
          </div>

          <div className="modal-form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="modal-form-group">
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" name="senha" required />
          </div>

          {/* Grid para Endereço */}
          <div className="modal-address-grid">
            <div className="modal-form-group">
              <label htmlFor="rua">Rua</label>
              <input type="text" id="rua" name="rua" />
            </div>
            <div className="modal-form-group">
              <label htmlFor="bairro">Bairro</label>
              <input type="text" id="bairro" name="bairro" />
            </div>
            <div className="modal-form-group">
              <label htmlFor="numero">Número</label>
              <input type="number" id="numero" name="numero" />
            </div>
          </div>

          <div className="modal-form-group">
            <label htmlFor="satisfacao">Nível de Satisfação (1-5)</label>
            <input type="number" id="satisfacao" name="satisfacao" min="1" max="5" />
          </div>

          {/* Botões do Rodapé */}
          <footer className="modal-footer">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn modal-btn-primary">
              Salvar Usuário
            </button>
          </footer>

        </form>
      </div>
    </div>
  );
}

export default InserirUsuario;