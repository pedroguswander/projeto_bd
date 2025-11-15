import React, { useState } from 'react';
import './Obra.css'; // Usando o CSS compartilhado
import { useCreateObra } from '../hooks/useCreateObra'; // Importando o Hook

function InserirObra({ onClose }) {
  // Hook de criação
  // apiError agora contém a string de erro do backend, se houver.
  const { createObra, isLoading, error: apiError } = useCreateObra();
  
  // O estado inicial reflete o novo DTO
  const [formData, setFormData] = useState({
    nome: '',
    fkGeneroGeneroPK: '', // ID do Gênero (FK)
    sinopse: '',
    dataLancamento: '', // Formato yyyy-mm-dd para input 'date'
    qntTemporadas: 0, // 0 para filmes, >0 para séries
    duracao: '00:00:00', // Formato HH:mm:ss
    obraTIPO: 0, // 0 = Filme, 1 = Série/TV Show
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // O valor de 'obraTIPO' e 'fkGeneroGeneroPK' deve ser tratado como número
    const newValue = (name === 'obraTIPO' || name === 'fkGeneroGeneroPK' || name === 'qntTemporadas') 
      ? parseInt(value, 10) 
      : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // O hook lança o erro, mas não precisamos fazer nada no catch aqui,
      // pois o estado 'apiError' será atualizado e o erro exibido no JSX.
      await createObra(formData);
      console.log('Obra criada com sucesso!');
      onClose(); // Fecha o modal após salvar
    } catch (err) {
      // O erro já está sendo tratado e o estado 'apiError' atualizado no hook.
      console.log("Falha ao criar obra. Mensagem exibida no alerta.");
    }
  };

  // Determina se o campo de temporadas deve ser exibido
  const isSerie = formData.obraTIPO === 1;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Adicionar Nova Obra (Filme/Série)</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Exibição de Erro como Caixa Vermelha (BTN ALERT) */}
          {apiError && (
            <div className="alert-error-box">
              ⚠️ **{apiError}**
            </div>
          )}
          
          {/* Campo Nome */}
          <div className="form-group">
            <label htmlFor="nome">Título da Obra</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required disabled={isLoading} />
          </div>

          {/* Campo Tipo de Obra (obraTIPO) */}
          <div className="form-group">
            <label>Tipo de Obra</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="obraTIPO" value={0} checked={formData.obraTIPO === 0} onChange={handleChange} disabled={isLoading} /> Filme
              </label>
              <label>
                <input type="radio" name="obraTIPO" value={1} checked={formData.obraTIPO === 1} onChange={handleChange} disabled={isLoading} /> Série/TV Show
              </label>
            </div>
          </div>

          {/* Campo FK Gênero */}
          <div className="form-group">
            <label htmlFor="fkGeneroGeneroPK">Código do Gênero (FK)</label>
            <input type="number" id="fkGeneroGeneroPK" name="fkGeneroGeneroPK" value={formData.fkGeneroGeneroPK} onChange={handleChange} required disabled={isLoading} min="1" />
            {/* Em uma aplicação real, aqui seria um <select> populado */}
          </div>
          
          {/* Campo Sinopse */}
          <div className="form-group">
            <label htmlFor="sinopse">Sinopse</label>
            <textarea id="sinopse" name="sinopse" value={formData.sinopse} onChange={handleChange} disabled={isLoading} rows="3" />
          </div>

          <div className="form-row">
            {/* Campo Data de Lançamento */}
            <div className="form-group">
              <label htmlFor="dataLancamento">Data de Lançamento</label>
              <input type="date" id="dataLancamento" name="dataLancamento" value={formData.dataLancamento} onChange={handleChange} disabled={isLoading} />
            </div>
            
            {/* Campo Duração (Time) */}
            <div className="form-group">
              <label htmlFor="duracao">Duração (HH:MM:SS)</label>
              <input type="time" id="duracao" name="duracao" value={formData.duracao} onChange={handleChange} disabled={isLoading} step="1" />
            </div>
          </div>

          {/* Campo Quantidade de Temporadas (Apenas para Séries) */}
          {isSerie && (
            <div className="form-group">
              <label htmlFor="qntTemporadas">Quantidade de Temporadas</label>
              <input type="number" id="qntTemporadas" name="qntTemporadas" min="1" value={formData.qntTemporadas} onChange={handleChange} required disabled={isLoading} />
            </div>
          )}

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="button-secondary" disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="button-primary" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Obra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InserirObra;