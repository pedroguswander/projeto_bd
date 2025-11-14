import React, { useState } from 'react';
import './Modal.css'; // Importando o novo CSS
import { FaTimes } from 'react-icons/fa';
import { useBuscarContas } from '../hooks/useBuscarContas';
import { useDeletarConta } from '../hooks/useDeletarConta';

function DeletarConta({ onClose }) {
    const { data: contas, isLoading: isLoadingContas } = useBuscarContas();
    const mutacaoDeletar = useDeletarConta();
    const [selectedContaId, setSelectedContaId] = useState('');

    const handleModalContentClick = (e) => e.stopPropagation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedContaId) return;

        try {
            await mutacaoDeletar.mutateAsync(Number(selectedContaId));
            alert('Conta deletada com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao deletar conta:', error);
            alert('Falha ao deletar a conta.');
        }
    };

    const isSaving = mutacaoDeletar.isPending;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <header className="modal-header">
                    <h2>Deletar Conta</h2>
                    <button onClick={onClose} className="modal-close-btn" disabled={isSaving}>
                        <FaTimes />
                    </button>
                </header>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <label htmlFor="contaSelect">Selecione a Conta para Deletar</label>
                        <select id="contaSelect" value={selectedContaId} onChange={(e) => setSelectedContaId(e.target.value)} required>
                            <option value="">-- Selecione --</option>
                            {isLoadingContas ? (
                                <option disabled>Carregando...</option>
                            ) : (
                                contas?.map(conta => (
                                    <option key={conta.codigo} value={conta.codigo}>
                                        Conta (Cód: {conta.codigo}) - Usuário ID: {conta.fkUsuarioId}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <footer className="modal-footer">
                        <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose} disabled={isSaving}>
                            Cancelar
                        </button>
                        <button type="submit" className="modal-btn modal-btn-danger" disabled={isSaving || !selectedContaId}>
                            {isSaving ? 'Deletando...' : 'Deletar Conta'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}

export default DeletarConta;