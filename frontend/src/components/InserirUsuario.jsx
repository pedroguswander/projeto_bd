import React, { useState } from "react";
import "./Usuario.css";
import { useInserirUsuario } from "../hooks/useInserirUsuario";

export const InserirUsuario = ({ onClose }) => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    rua: "",
    bairro: "",
    numero: "",
  });

  const inserirMutation = useInserirUsuario();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    inserirMutation.mutate(form, {
      onSuccess: () => {
        alert("Usuário inserido com sucesso!");
        onClose && onClose();
      },
    });
  };

  return (
    <div className="usuario-container">
      <div className="usuario-modal">
        <div className="usuario-modal-header">
          <h2>Adicionar Novo Usuário</h2>
          <button className="usuario-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="usuario-form">
          <label className="usuario-label">Nome Completo</label>
          <input className="usuario-input" name="nome" value={form.nome} onChange={handleChange} />

          <label className="usuario-label">Email</label>
          <input className="usuario-input" name="email" value={form.email} onChange={handleChange} />

          <label className="usuario-label">Senha</label>
          <input type="password" className="usuario-input" name="senha" value={form.senha} onChange={handleChange} />

          <div className="usuario-row">
            <div>
              <label className="usuario-label">Rua</label>
              <input className="usuario-input" name="rua" value={form.rua} onChange={handleChange} />
            </div>
            <div>
              <label className="usuario-label">Bairro</label>
              <input className="usuario-input" name="bairro" value={form.bairro} onChange={handleChange} />
            </div>
            <div>
              <label className="usuario-label">Número</label>
              <input type="number" className="usuario-input" name="numero" value={form.numero} onChange={handleChange} />
            </div>
          </div>

          <div className="usuario-buttons">
            <button type="button" className="usuario-btn-cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="usuario-btn-salvar">Salvar Usuário</button>
          </div>
        </form>
      </div>
    </div>
  );
};
