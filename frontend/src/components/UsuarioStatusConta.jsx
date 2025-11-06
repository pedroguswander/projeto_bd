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

  // Estado para controlar qual usuário está em modo de edição
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null); // { id: 1, novoStatus: 'ATIVA' }

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

  // 2. Manipuladores de Eventos
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

  // 3. Renderização
  return (
    <div className="gerenciamento-container">
      <h1 className="page-title">
        Gerenciamento de Status de Contas
      </h1>
      <div className="card-grid">
        {usuarios && usuarios.map((usuario) => (
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
      </div>
    </div>
  );
};

// --- Componente CardUsuario Atualizado com Classes CSS ---
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
    tipo_conta,
    status_assinatura,
    data_criacao_conta,
  } = usuario;

  // Função auxiliar para estilizar o status (AGORA RETORNA CLASSES CSS)
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ATIVA':
        return 'status-ativa';
      case 'CANCELADA':
        return 'status-cancelada';
      case 'PENDENTE':
        return 'status-pendente';
      case 'BLOQUEADA':
        return 'status-bloqueada';
      default:
        return 'status-default';
    }
  };

  return (
    // Usa a classe 'card-usuario' para estilo de card, sombra e animação
    <div className="card-usuario">
      <h2 className="card-title">{nome_usuario} (ID: {usuario_id})</h2>
      <p className="card-email">{email}</p>

      <div className="card-info">
        <p className="info-item">
          **Tipo de Conta:** <span className="info-value">{tipo_conta}</span>
        </p>
        <p className="info-item">
          **Data de Criação:** <span className="info-value">{new Date(data_criacao_conta).toLocaleDateString()}</span>
        </p>
        <p className="info-item status-line">
          **Status Atual:**
          <span
            // Usa a classe 'card-status-badge' para o formato de pílula
            className={`card-status-badge ${getStatusStyle(status_assinatura)}`}
          >
            {status_assinatura}
          </span>
        </p>
      </div>

      {/* Condicional para o Botão/Formulário */}
      {!isEditing ? (
        <button
          onClick={onMudarStatusClick}
          // Usa a classe customizada 'btn-primary' e 'btn-full-width'
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
          
          {/* Botões responsivos */}
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