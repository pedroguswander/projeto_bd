import React, { useState } from 'react';
import './Obra.css'; // Reutilizando o mesmo CSS

function DeletarObra({ onClose }) {
  const [idDeletar, setIdDeletar] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Confirmação extra antes de deletar
    if (window.confirm(`Tem certeza que deseja deletar a obra com ID: ${idDeletar}? Esta ação não pode ser desfeita.`)) {
      console.log('Deletando obra com ID:', idDeletar);
      // Aqui você adicionaria a lógica de API (DELETE)
      onClose(); // Fecha o modal após deletar
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
            <label htmlFor="idDeletar">ID da Obra a ser Deletada</label>
            <input
              type="text"
              id="idDeletar"
              name="idDeletar"
              value={idDeletar}
              onChange={(e) => setIdDeletar(e.target.value)}
              required
            />
          </div>
          
          <p className="warning-text">
            <strong>Atenção:</strong> Esta ação é irreversível.
          </p>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="button-secondary">
              Cancelar
            </button>
            <button type="submit" className="button-danger">
              Deletar Obra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeletarObra;