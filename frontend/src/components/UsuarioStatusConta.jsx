// UsuarioStatusConta.jsx

import React, { useState } from 'react';
// IMPORTAÇÕES NECESSÁRIAS
import { useDetalhesContas } from '../hooks/useDetalhesConta';
import { useAtualizarStatus } from '../hooks/useAtualizarStatus';
// Importação do CSS (agora 100% responsável pelo estilo)
import './UsuarioStatusConta.css';

// --- Definição dos Status para o Select ---
const STATUSES_ASSINATURA = [
  'Ativa',
  'Cancelada',
  'Pendente',
  'Expirada',
];

/**
 * Componente principal para listar usuários e permitir a alteração do status da conta.
 */
const UsuarioStatusConta = () => {
  // HOOK 1: Buscar dados dos usuários e contas
  const { data: usuarios, isLoading, isError, error } = useDetalhesContas();

  // HOOK 2: Hook de mutação para atualizar o status
  const { mutate, isPending: isUpdating } = useAtualizarStatus();

  // ESTADO: Armazena o ID digitado para pesquisa
  const [termoPesquisa, setTermoPesquisa] = useState('');
  
  // Estado para controlar qual usuário está em modo de edição
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);

  // 1. Tratamento de Estados da Query (Loading/Erro)
  if (isLoading) {
    return <div className="loading-state">Carregando detalhes dos usuários...</div>;
  }

  if (isError) {
    return (
      <div className="error-state">
        Erro ao carregar os dados: {error.message}
      </div>
    );
  }

  // 2. Manipuladores de Eventos (MANTIDOS)
  const handleMudarStatusClick = (usuario) => {
    setUsuarioEmEdicao({
      id: usuario.usuario_id,
      novoStatus: usuario.status_assinatura,
    });
  };

  const handleStatusChange = (e) => {
    setUsuarioEmEdicao({
      ...usuarioEmEdicao,
      novoStatus: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuarioEmEdicao) return;

    mutate(
      {
        usuarioId: usuarioEmEdicao.id,
        novoStatus: usuarioEmEdicao.novoStatus,
      },
      {
        onSuccess: () => {
          setUsuarioEmEdicao(null);
          console.log(`Status do usuário ${usuarioEmEdicao.id} alterado com sucesso para ${usuarioEmEdicao.novoStatus}!`);
        },
        onError: () => {
          setUsuarioEmEdicao(null);
        }
      }
    );
  };

  // 3. Lógica de Filtragem
  // Se termoPesquisa for vazio, usuariosFiltrados é uma lista vazia, garantindo que nada seja exibido.
  const usuariosFiltrados = termoPesquisa 
    ? usuarios?.filter(usuario => String(usuario.usuario_id).startsWith(termoPesquisa))
    : [];
  
  // Condição para exibir os resultados: APENAS se algo foi digitado.
  const deveExibirResultados = termoPesquisa.length > 0;
  
  // 4. Renderização (AJUSTADA PARA FICAR VAZIA POR PADRÃO)
  return (
    <div className="gerenciamento-container">
      <h1 className="page-title">
        Gerenciamento de Status de Contas
      </h1>
      
      {/* CAMPO DE PESQUISA POR ID */}
      <div className="search-bar-container">
        <input
          type="number"
          placeholder="Pesquisar por ID do Usuário..."
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Condição: Só mostra a grade de cards e as mensagens de resultado se algo foi digitado */}
      {deveExibirResultados && (
        <div className="card-grid">
          {/* Mapeando a lista FILTRADA */}
          {usuariosFiltrados && usuariosFiltrados.map((usuario) => (
            <CardUsuario
              key={usuario.usuario_id}
              usuario={usuario}
              isEditing={usuarioEmEdicao?.id === usuario.usuario_id}
              isUpdating={isUpdating}
              onMudarStatusClick={() => handleMudarStatusClick(usuario)}
              onCancel={() => setUsuarioEmEdicao(null)}
              onSubmit={handleSubmit}
              onStatusChange={handleStatusChange}
              novoStatus={usuarioEmEdicao?.novoStatus}
            />
          ))}

          {/* Mensagem de Sem Resultados (se algo foi digitado e a lista está vazia) */}
          {usuariosFiltrados?.length === 0 && (
            <p className="no-results-message">Nenhuma conta encontrada com o ID "{termoPesquisa}".</p>
          )}
        </div>
      )}
      {/* Se !deveExibirResultados (ou seja, termoPesquisa está vazio), NADA é renderizado aqui. */}
    </div>
  );
};

// --- Componente CardUsuario (MANTIDO) ---
const CardUsuario = ({
  usuario,
  isEditing,
  isUpdating,
  onMudarStatusClick,
  onCancel,
  onSubmit,
  onStatusChange,
  novoStatus,
}) => {
  const {
    usuario_id,
    nome_usuario,
    email,
    status_assinatura,
  } = usuario;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Ativa':
        return 'status-ativa';
      case 'Cancelada':
        return 'status-cancelada';
      case 'Pendente':
        return 'status-pendente';
      case 'Expirada':
      case 'BLOQUEADA':
        return 'status-bloqueada';
      default:
        return 'status-default';
    }
  };

  return (
    <div className="card-usuario">
      <h2 className="card-title">{nome_usuario} (ID: {usuario_id})</h2>
      <p className="card-email">{email}</p>

      <div className="card-info">
        <p className="info-item status-line">
          <span className="info-label">Status Atual:</span> 
          <span
            className={`card-status-badge ${getStatusStyle(status_assinatura)}`}
          >
            {status_assinatura}
          </span>
        </p>
      </div>

      {!isEditing ? (
        <button
          onClick={onMudarStatusClick}
          className="btn-primary btn-full-width"
          disabled={isUpdating}
        >
          {isUpdating ? 'Atualizando...' : 'Mudar Status'}
        </button>
      ) : (
        <form onSubmit={onSubmit} className="card-form">
          <label htmlFor={`status-${usuario_id}`} className="form-label">
            Novo Status de Assinatura:
          </label>
          <select
            id={`status-${usuario_id}`}
            name="novoStatus"
            value={novoStatus || status_assinatura}
            onChange={onStatusChange} 
            className="form-select"
            disabled={isUpdating}
          >
            {STATUSES_ASSINATURA.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          
          <div className="form-button-group">
            <button
              type="submit"
              className="btn-submit"
              disabled={isUpdating}
            >
              {isUpdating ? 'Confirmando...' : 'Confirmar Alteração'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-cancel"
              disabled={isUpdating}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UsuarioStatusConta;