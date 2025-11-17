import React, { useState } from 'react';
import './Modal.css'; // Reutilizando o CSS de modal
import { FaTimes } from 'react-icons/fa';
import { useInserirGenero } from '../hooks/useInserirGenero';

function InserirGenero({ onClose }) {
    const mutacao = useInserirGenero();
    const [nome, setNome] = useState('');

    const handleModalContentClick = (e) => e.stopPropagation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await mutacao.mutateAsync({ nome });
            alert('Gênero criado com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao inserir gênero:', error);
            alert('Falha ao criar gênero.');
        }
    };

    const isSaving = mutacao.isPending;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <header className="modal-header">
                    <h2>Adicionar Novo Gênero</h2>
                    <button onClick={onClose} className="modal-close-btn" disabled={isSaving}>
                        <FaTimes />
                    </button>
                </header>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <label htmlFor="nome">Nome do Gênero</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <footer className="modal-footer">
                        <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose} disabled={isSaving}>
                            Cancelar
                        </button>
                        <button type="submit" className="modal-btn modal-btn-primary" disabled={isSaving}>
                            {isSaving ? 'Salvando...' : 'Salvar Gênero'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}

export default InserirGenero;