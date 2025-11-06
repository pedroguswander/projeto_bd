import React, { useState } from 'react';
import './Obra.css'; // Reutilizando o mesmo CSS

function AtualizarObra({ onClose }) {
  const [idBusca, setIdBusca] = useState('');
  const [obraEncontrada, setObraEncontrada] = useState(null);
  const [formData, setFormData] = useState(null);

  // Etapa 1: Buscar a obra
  const handleBusca = (e) => {
    e.preventDefault();
    // Simulação de busca na API
    console.log('Buscando obra com ID:', idBusca);
    const mockObra = {
      id: idBusca,
      nome: 'Reforma Fachada Edifício Central',
      status: 'em_andamento',
      responsavel: 'arquiteto@email.com',
      rua: 'Av. Principal',
      bairro: 'Centro',
      numero: '100',
      prioridade: 4,
    };
    
    // Preenche os dados da obra encontrada
    setObraEncontrada(mockObra);
    setFormData(mockObra);
  };

  // Etapa 2: Atualizar a obra
  const handleAtualizar = (e) => {
    e.preventDefault();
    console.log('Atualizando Obra:', formData);
    // Aqui você adicionaria a lógica de API (PUT/PATCH)
    onClose(); // Fecha o modal após atualizar
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetBusca = () => {
    setObraEncontrada(null);
    setFormData(null);
    setIdBusca('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Atualizar Obra</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        {!obraEncontrada ? (
          // Etapa 1: Formulário de Busca
          <form onSubmit={handleBusca} className="modal-body">
            <div className="form-group">
              <label htmlFor="idBusca">Buscar Obra por ID</label>
              <input
                type="text"
                id="idBusca"
                name="idBusca"
                value={idBusca}
                onChange={(e) => setIdBusca(e.target.value)}
                required
              />
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="button-secondary">
                Cancelar
              </button>
              <button type="submit" className="button-primary">
                Buscar
              </button>
            </div>
          </form>
        ) : (
          // Etapa 2: Formulário de Atualização (similar ao de Inserir)
          <form onSubmit={handleAtualizar} className="modal-body">
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
              <button type="button" onClick={resetBusca} className="button-secondary">
                Buscar Outra
              </button>
              <button type="submit" className="button-primary">
                Atualizar Obra
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AtualizarObra;