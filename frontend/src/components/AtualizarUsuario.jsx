import React, { useState } from "react";
import "./Usuario.css";
import { useBuscarUsuarioPorId, useAtualizarUsuario } from "../hooks/useAtualizarUsuario";

export const AtualizarUsuario = ({ onClose }) => {
  const [id, setId] = useState("");
  const [dados, setDados] = useState(null);
  const buscarUsuario = useBuscarUsuarioPorId(id);
  const atualizarMutation = useAtualizarUsuario();

  const handleBuscar = () => {
    buscarUsuario.refetch();
    setDados(buscarUsuario.data);
  };

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    atualizarMutation.mutate({ id, usuario: dados }, {
      onSuccess: () => {
        alert("Usuário atualizado!");
        onClose && onClose();
      },
    });
  };

  return (
    <div className="usuario-container">
      <div className="usuario-modal">
        <div className="usuario-modal-header">
          <h2>Atualizar Usuário</h2>
          <button className="usuario-close-btn" onClick={onClose}>×</button>
        </div>

        {!dados ? (
          <div className="usuario-form">
            <label className="usuario-label">Buscar por ID</label>
            <input className="usuario-input" value={id} onChange={(e) => setId(e.target.value)} />
            <div className="usuario-buttons">
              <button className="usuario-btn-salvar" onClick={handleBuscar}>Buscar</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="usuario-form">
            {["nome", "email", "senha", "rua", "bairro", "numero"].map((campo) => (
              <div key={campo}>
                <label className="usuario-label">{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
                <input
                  className="usuario-input"
                  name={campo}
                  value={dados[campo] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="usuario-buttons">
              <button type="button" className="usuario-btn-cancelar" onClick={onClose}>Cancelar</button>
              <button type="submit" className="usuario-btn-salvar">Salvar Alterações</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
