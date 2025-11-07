import React, { useState } from 'react';
import './Obra.css'; // Reutilizando o mesmo CSS
import { useGetObraById } from '../hooks/useGetObraById'; // Hook de busca
import { useUpdateObra } from '../hooks/useUpdateObra'; // Hook de atualização

function AtualizarObra({ onClose }) {
  const [idBusca, setIdBusca] = useState('');
  const [formData, setFormData] = useState(null); // Guarda os dados do form de atualização

  // Hooks
  const { getObra, isLoading: isGetLoading, error: getError } = useGetObraById();
  const { updateObra, isLoading: isUpdateLoading, error: updateError } = useUpdateObra();

  // Etapa 1: Buscar a obra
  const handleBusca = async (e) => {
    e.preventDefault();
    try {
      const obra = await getObra(idBusca); // Usa o hook para buscar
      if (obra) {
        // Formata os dados recebidos para o estado local, garantindo que a data seja 'yyyy-mm-dd'
        // e que a duração seja compatível com o input 'time' (assumindo que o back-end retorna a data/hora em formatos padrão)
        const formattedObra = {
          ...obra,
          // 'dataLancamento' deve estar no formato "YYYY-MM-DD" se vier como DateTime/Timestamp,
          // se já vier como LocalDate "YYYY-MM-DD" não precisa de conversão.
          // Aqui assumimos que vem formatado ou que o input 'date' lida com a string do back-end.
          // A duração é um campo Time no DTO, assumimos que vem como "HH:mm:ss"
        };
        setFormData(formattedObra); // Preenche o formulário com os dados encontrados
      }
    } catch (error) {
      // Erro já tratado pelo hook (estado getError)
      console.log("Obra não encontrada ou erro na busca.");
    }
  };

  // Etapa 2: Atualizar a obra
  const handleAtualizar = async (e) => {
    e.preventDefault();
    try {
      // O 'codigo' é o ID (vindo da busca)
      await updateObra(formData.codigo, formData);
      console.log('Obra atualizada com sucesso!');
      onClose(); // Fecha o modal após atualizar
    } catch (error) {
      // Erro já tratado pelo hook (estado updateError)
      console.log("Falha ao atualizar obra.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // O valor de 'obraTIPO' e 'fkGeneroGeneroPK' deve ser tratado como número
    const newValue = (name === 'obraTIPO' || name === 'fkGeneroGeneroPK' || name === 'qntTemporadas') ? parseInt(value, 10) : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  // Reseta para a tela de busca
  const resetBusca = () => {
    setFormData(null);
    setIdBusca('');
  };

  const isLoading = isGetLoading || isUpdateLoading;
  const isSerie = formData && formData.obraTIPO === 1;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Atualizar Obra</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        {!formData ? (
          // Etapa 1: Formulário de Busca
          <form onSubmit={handleBusca} className="modal-body">
            <div className="form-group">
              <label htmlFor="idBusca">Buscar Obra por Código (ID)</label>
              <input
                type="text"
                id="idBusca"
                name="idBusca"
                value={idBusca}
                onChange={(e) => setIdBusca(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {getError && <p className="error-text">Erro: {getError.message || 'Falha ao buscar.'}</p>}
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="button-secondary" disabled={isLoading}>
                Cancelar
              </button>
              <button type="submit" className="button-primary" disabled={isLoading}>
                {isGetLoading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>
        ) : (
          // Etapa 2: Formulário de Atualização
          <form onSubmit={handleAtualizar} className="modal-body">
            {/* Campo Código (somente visualização) */}
            <div className="form-group">
                <label htmlFor="codigo">Código da Obra</label>
                <input type="text" id="codigo" name="codigo" value={formData.codigo} disabled readOnly />
            </div>

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

            {updateError && <p className="error-text">Erro: {updateError.message || 'Não foi possível atualizar.'}</p>}

            <div className="modal-footer">
              <button type="button" onClick={resetBusca} className="button-secondary" disabled={isLoading}>
                Buscar Outra
              </button>
              <button type="submit" className="button-primary" disabled={isLoading}>
                {isUpdateLoading ? 'Atualizando...' : 'Atualizar Obra'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AtualizarObra;