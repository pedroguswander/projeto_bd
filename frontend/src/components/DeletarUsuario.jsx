import React, { useState } from "react";
import "./Usuario.css";
import { useDeletarUsuario } from "../hooks/useDeletarUsuario";

export const DeletarUsuario = ({ onClose }) => {
  const [id, setId] = useState("");
  const deletarMutation = useDeletarUsuario();

  const handleDelete = () => {
    if (!id) return alert("Informe um ID válido.");
    deletarMutation.mutate(id, {
      onSuccess: () => {
        alert("Usuário deletado com sucesso!");
        onClose && onClose();
      },
    });
  };

  return (
    <div className="usuario-container">
      <div className="usuario-modal">
        <div className="usuario-modal-header">
          <h2>Deletar Usuário</h2>
          <button className="usuario-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="usuario-form">
          <label className="usuario-label">Informe o ID do Usuário</label>
          <input
            className="usuario-input"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <div className="usuario-buttons">
            <button className="usuario-btn-cancelar" onClick={onClose}>Cancelar</button>
            <button className="usuario-btn-salvar" onClick={handleDelete}>Deletar</button>
          </div>
        </div>
      </div>
    </div>
  );
};
