import React, { useState } from 'react';
import './Modal.css';
import { FaTimes } from 'react-icons/fa';
import { useBuscarGeneros } from '../hooks/useBuscarGeneros';
import { useDeletarGenero } from '../hooks/useDeletarGenero';

function DeletarGenero({ onClose }) {
    const { data: generos, isLoading: isLoadingGeneros } = useBuscarGeneros();
    const mutacao = useDeletarGenero();
    const [selectedId, setSelectedId] = useState('');

    const handleModalContentClick = (e) => e.stopPropagation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedId) return;

        try {
            await mutacao.mutateAsync(Number(selectedId));
            alert('Gênero deletado com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao deletar gênero:', error);
            alert('Falha ao deletar gênero.');
        }
    };

    const isSaving = mutacao.isPending;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <header className="modal-header">
                    <h2>Deletar Gênero</h2>
                    <button onClick={onClose} className="modal-close-btn" disabled={isSaving}>
                        <FaTimes />
                    </button>
                </header>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <label htmlFor="generoSelect">Selecione o Gênero para Deletar</label>
                        <select id="generoSelect" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
                            <option value="">-- Selecione --</option>
                            {isLoadingGeneros ? (
                                <option disabled>Carregando...</option>
                            ) : (
                                generos?.map(g => (
                                    <option key={g.genero_PK} value={g.genero_PK}>
                                        {g.nome} (ID: {g.genero_PK})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <footer className="modal-footer">
                        <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose} disabled={isSaving}>
                            Cancelar
                        </button>
                        <button type="submit" className="modal-btn modal-btn-danger" disabled={isSaving || !selectedId}>
                            {isSaving ? 'Deletando...' : 'Deletar Gênero'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}

export default DeletarGenero;