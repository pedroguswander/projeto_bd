import React, { useState } from 'react';
import './Obra.css'; // Reutilizando o mesmo CSS
import { useDeleteObra } from '../hooks/useDeleteObra'; // Importando o Hook

function DeletarObra({ onClose }) {
  const [idDeletar, setIdDeletar] = useState('');
  
  // Hook de deleção
  const { deleteObra, isLoading, error: apiError } = useDeleteObra();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Substituímos o window.confirm por uma UI mais limpa.
    // Para este exemplo, o duplo clique no botão (após inserir o ID) é a confirmação.
    // Em uma app real, você poderia adicionar um segundo estado de confirmação.
    
    try {
      await deleteObra(idDeletar);
      console.log('Obra deletada com sucesso!');
      onClose(); // Fecha o modal após deletar
    } catch (err) {
      // Erro já tratado pelo hook (estado apiError)
      console.log("Falha ao deletar obra.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Deletar Obra</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="idDeletar">Código (ID) da Obra a ser Deletada</label>
            <input
              type="text"
              id="idDeletar"
              name="idDeletar"
              value={idDeletar}
              onChange={(e) => setIdDeletar(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <p className="warning-text">
            <strong>Atenção:</strong> Esta ação é irreversível.
          </p>

          {apiError && <p className="error-text">Erro: {apiError.message || 'Não foi possível deletar.'}</p>}

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="button-secondary" disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="button-danger" disabled={isLoading}>
              {isLoading ? 'Deletando...' : 'Deletar Obra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeletarObra;