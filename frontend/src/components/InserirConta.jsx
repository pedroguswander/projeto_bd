import React, { useState } from 'react';
import './Modal.css'; // Importando o novo CSS
import { FaTimes } from 'react-icons/fa';
import { useInserirConta } from '../hooks/useInserirConta';

function InserirConta({ onClose }) {
    const mutacaoConta = useInserirConta();
    const [formData, setFormData] = useState({
        fkUsuarioId: '',
        fkAdministradorId: '',
        dataExpiracao: '',
        statusAssinatura: 'Pendente',
        icone: 'avatar_default.png',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleModalContentClick = (e) => e.stopPropagation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dadosConta = {
            ...formData,
            fkUsuarioId: Number(formData.fkUsuarioId),
            fkAdministradorId: formData.fkAdministradorId ? Number(formData.fkAdministradorId) : null,
        };

        try {
            await mutacaoConta.mutateAsync(dadosConta);
            alert('Conta criada com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao inserir Conta:', error);
            if (error.response?.data?.message.includes('FOREIGN KEY (`fk_usuario_id`)')) {
                alert('Erro: O ID de Usuário fornecido não existe.');
            } else if (error.response?.data?.message.includes('Duplicate entry')) {
                alert('Erro: Este usuário já possui uma conta.');
            } else {
                alert('Ocorreu um erro ao salvar a conta.');
            }
        }
    };

    const isSaving = mutacaoConta.isPending;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <header className="modal-header">
                    <h2>Adicionar Nova Conta</h2>
                    <button onClick={onClose} className="modal-close-btn" disabled={isSaving}>
                        <FaTimes />
                    </button>
                </header>

                <form className="modal-form" onSubmit={handleSubmit}>
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

                    <footer className="modal-footer">
                        <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose} disabled={isSaving}>
                            Cancelar
                        </button>
                        <button type="submit" className="modal-btn modal-btn-primary" disabled={isSaving}>
                            {isSaving ? 'Salvando...' : 'Salvar Conta'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}

export default InserirConta;