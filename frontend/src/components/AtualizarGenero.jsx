import React, { useState, useEffect } from 'react';
import './Modal.css';
import { FaTimes } from 'react-icons/fa';
import { useBuscarGeneros } from '../hooks/useBuscarGeneros';
import { useAtualizarGenero } from '../hooks/useAtualizarGenero';

function AtualizarGenero({ onClose }) {
    const { data: generos, isLoading: isLoadingGeneros } = useBuscarGeneros();
    const mutacao = useAtualizarGenero();

    const [selectedId, setSelectedId] = useState('');
    const [nome, setNome] = useState('');

    useEffect(() => {
        if (selectedId) {
            const generoSel = generos?.find(g => g.genero_PK === Number(selectedId));
            if (generoSel) {
                setNome(generoSel.nome);
            }
        } else {
            setNome('');
        }
    }, [selectedId, generos]);

    const handleModalContentClick = (e) => e.stopPropagation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedId) return;

        try {
            await mutacao.mutateAsync({
                id: Number(selectedId),
                generoData: { nome, genero_PK: Number(selectedId) }
            });
            alert('Gênero atualizado com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar gênero:', error);
            alert('Falha ao atualizar gênero.');
        }
    };

    const isSaving = mutacao.isPending;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <header className="modal-header">
                    <h2>Atualizar Gênero</h2>
                    <button onClick={onClose} className="modal-close-btn" disabled={isSaving}>
                        <FaTimes />
                    </button>
                </header>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <label htmlFor="generoSelect">Selecione o Gênero</label>
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

                    {selectedId && (
                        <div className="modal-form-group">
                            <label htmlFor="nome">Novo Nome</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <footer className="modal-footer">
                        <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose} disabled={isSaving}>
                            Cancelar
                        </button>
                        <button type="submit" className="modal-btn modal-btn-primary" disabled={isSaving || !selectedId}>
                            {isSaving ? 'Atualizando...' : 'Atualizar Gênero'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}

export default AtualizarGenero;