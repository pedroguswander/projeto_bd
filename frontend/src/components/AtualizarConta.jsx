import React, { useState, useEffect } from 'react';
import './Modal.css'; // Importando o novo CSS
import { FaTimes } from 'react-icons/fa';
import { useBuscarContas } from '../hooks/useBuscarContas';
import { useAtualizarConta } from '../hooks/useAtualizarConta';

function AtualizarConta({ onClose }) {
    const { data: contas, isLoading: isLoadingContas } = useBuscarContas();
    const mutacaoAtualizar = useAtualizarConta();

    const [selectedContaId, setSelectedContaId] = useState('');
    const [formData, setFormData] = useState({
        dataExpiracao: '', icone: '', statusAssinatura: '',
        fkUsuarioId: '', fkAdministradorId: '',
    });

    useEffect(() => {
        if (selectedContaId) {
            const contaSel = contas?.find(c => c.codigo === Number(selectedContaId));
            if (contaSel) {
                setFormData({
                    dataExpiracao: contaSel.dataExpiracao ? contaSel.dataExpiracao.split('T')[0] : '', // Formata data
                    icone: contaSel.icone || '',
                    statusAssinatura: contaSel.statusAssinatura || '',
                    fkUsuarioId: contaSel.fkUsuarioId || '',
                    fkAdministradorId: contaSel.fkAdministradorId || '',
                });
            }
        } else {
            setFormData({ dataExpiracao: '', icone: '', statusAssinatura: '', fkUsuarioId: '', fkAdministradorId: '' });
        }
    }, [selectedContaId, contas]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleModalContentClick = (e) => e.stopPropagation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedContaId) return;

        const id = Number(selectedContaId);
        const contaData = {
            ...formData,
            codigo: id,
            fkUsuarioId: Number(formData.fkUsuarioId),
            fkAdministradorId: formData.fkAdministradorId ? Number(formData.fkAdministradorId) : null,
        };

        try {
            await mutacaoAtualizar.mutateAsync({ id, contaData });
            alert('Conta atualizada com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar conta:', error);
            alert('Falha ao atualizar a conta.');
        }
    };

    const isSaving = mutacaoAtualizar.isPending;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <header className="modal-header">
                    <h2>Atualizar Conta</h2>
                    <button onClick={onClose} className="modal-close-btn" disabled={isSaving}>
                        <FaTimes />
                    </button>
                </header>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <label htmlFor="contaSelect">Selecione a Conta</label>
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

                    {selectedContaId && (
                        <>
                            <div className="modal-form-group">
                                <label htmlFor="fkUsuarioId">ID do Usuário (Obrigatório)</label>
                                <input type="number" id="fkUsuarioId" name="fkUsuarioId" value={formData.fkUsuarioId} onChange={handleChange} required />
                            </div>
                            <div className="modal-form-group">
                                <label htmlFor="fkAdministradorId">ID do Administrador (Opcional)</label>
                                <input type="number" id="fkAdministradorId" name="fkAdministradorId" value={formData.fkAdministradorId} onChange={handleChange} />
                            </div>
                            <div className="modal-form-group">
                                <label htmlFor="dataExpiracao">Data de Expiração</label>
                                <input type="date" id="dataExpiracao" name="dataExpiracao" value={formData.dataExpiracao} onChange={handleChange} />
                            </div>
                            <div className="modal-form-group">
                                <label htmlFor="statusAssinatura">Status da Assinatura</label>
                                <select id="statusAssinatura" name="statusAssinatura" value={formData.statusAssinatura} onChange={handleChange}>
                                    <option value="Pendente">Pendente</option>
                                    <option value="Ativa">Ativa</option>
                                    <option value="Cancelada">Cancelada</option>
                                    <option value="Expirada">Expirada</option>
                                </select>
                            </div>
                            <div className="modal-form-group">
                                <label htmlFor="icone">Nome do Ícone</label>
                                <input type="text" id="icone" name="icone" value={formData.icone} onChange={handleChange} />
                            </div>
                        </>
                    )}

                    <footer className="modal-footer">
                        <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose} disabled={isSaving}>
                            Cancelar
                        </button>
                        <button type="submit" className="modal-btn modal-btn-primary" disabled={isSaving || !selectedContaId}>
                            {isSaving ? 'Atualizando...' : 'Atualizar Conta'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}

export default AtualizarConta;