import React, { useState } from 'react';
import './Obra.css'; // Usaremos um CSS compartilhado

function InserirObra({ onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    status: 'pendente',
    responsavel: '',
    rua: '',
    bairro: '',
    numero: '',
    prioridade: 3,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados da Nova Obra:', formData);
    // Aqui você adicionaria a lógica de API (POST)
    onClose(); // Fecha o modal após salvar
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Adicionar Nova Obra</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="nome">Nome da Obra</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="status"
                  value="pendente"
                  checked={formData.status === 'pendente'}
                  onChange={handleChange}
                /> Pendente
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="em_andamento"
                  checked={formData.status === 'em_andamento'}
                  onChange={handleChange}
                /> Em Andamento
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="concluida"
                  checked={formData.status === 'concluida'}
                  onChange={handleChange}
                /> Concluída
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="responsavel">Email do Responsável</label>
            <input
              type="email"
              id="responsavel"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rua">Rua</label>
              <input
                type="text"
                id="rua"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bairro">Bairro</label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="numero">Número</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prioridade">Nível de Prioridade (1-5)</label>
            <input
              type="number"
              id="prioridade"
              name="prioridade"
              min="1"
              max="5"
              value={formData.prioridade}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="button-secondary">
              Cancelar
            </button>
            <button type="submit" className="button-primary">
              Salvar Obra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InserirObra;