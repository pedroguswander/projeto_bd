import React, { useState } from 'react';
import './InserirUsuarioPesquisa.css';
import { FaTimes } from 'react-icons/fa';
// Importando os hooks de mutação
import { useInserirUsuarioPesquisa } from '../hooks/useInserirUsuarioPesquisa';
import { useInserirPesquisa } from '../hooks/useInserirPesquisa';

function InserirUsuarioPesquisa({ onClose }) {
  // Hooks de mutação
  const mutacaoUsuario = useInserirUsuarioPesquisa();
  const mutacaoPesquisa = useInserirPesquisa();

  // Estado para armazenar os dados do formulário, incluindo todos os campos da pesquisa
  const [formData, setFormData] = useState({
    // Campos de USUARIO (para a primeira mutação)
    nome: '',
    email: '',
    senha: '',
    rua: '',
    bairro: '',
    numero: '',

    // Campos de PESQUISA (para a segunda mutação)
    ocupacao: '',
    regiao_residencia: '',
    genero: '', // Mapeado no formulário como radio (Masculino/Feminino)
    faixa_etaria: '',
    qtd_assinaturas: '',
    servicos_utilizados: [], // Array para checkboxes
    motivo_insatisfacao: [], // Array para checkboxes
    generos_assistidos: [], // Array para checkboxes
    frequencia_uso: '',
    horas_semanais: '',
    satisfacao_geral: '',
    satisfacao_recomendacao: '',
    dispositivos_utilizados: [], // Array para checkboxes
    preco_ideal_menos: '',
  });

  // Manipulador de mudança padrão para inputs de texto, número e select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manipulador de mudança para checkboxes (múltipla seleção)
  const handleMultiChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevData) => {
      const currentValues = prevData[name];
      if (checked) {
        // Adiciona o valor se o checkbox for marcado
        return { ...prevData, [name]: [...currentValues, value] };
      } else {
        // Remove o valor se o checkbox for desmarcado
        return { ...prevData, [name]: currentValues.filter((v) => v !== value) };
      }
    });
  };

  // Função para parar a propagação ao clicar no conteúdo do modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // Função para lidar com o submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Coletar dados para a tabela 'usuario'
    const dadosUsuario = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      rua: formData.rua,
      bairro: formData.bairro,
      numero: formData.numero ? Number(formData.numero) : null,
    };

    try {
      // **Chama useInserirUsuario**
      const usuarioCriado = await mutacaoUsuario.mutateAsync(dadosUsuario);

      console.log('Usuário criado:', usuarioCriado);

      // Pega o ID do usuário criado para usar como FK na pesquisa
      const usuarioId = usuarioCriado.usuarioId; 

      if (!usuarioId) {
          throw new Error("ID do usuário não foi retornado após a criação.");
      }

      // 2. Coletar dados para a tabela 'pesquisa'
      const dadosPesquisa = {
        fk_usuario_id: usuarioId, // ID do usuário que acabamos de criar
        email: formData.email,
        
        // Campos de PESQUISA
        ocupacao: formData.ocupacao || null,
        regiao_residencia: formData.regiao_residencia || null,
        genero: formData.genero || null,
        faixa_etaria: formData.faixa_etaria || null,
        qtd_assinaturas: formData.qtd_assinaturas ? Number(formData.qtd_assinaturas) : null,
        
        // Campos de múltipla seleção: convertendo array para string separada por vírgula
        servicos_utilizados: formData.servicos_utilizados.join(', ') || null, 
        motivo_insatisfacao: formData.motivo_insatisfacao.join(', ') || null,
        generos_assistidos: formData.generos_assistidos.join(', ') || null,
        dispositivos_utilizados: formData.dispositivos_utilizados.join(', ') || null,

        frequencia_uso: formData.frequencia_uso || null,
        horas_semanais: formData.horas_semanais || null,
        
        // Campos de Satisfação (convertendo para número)
        satisfacao_geral: formData.satisfacao_geral ? Number(formData.satisfacao_geral) : null,
        satisfacao_recomendacao: formData.satisfacao_recomendacao ? Number(formData.satisfacao_recomendacao) : null,
        
        preco_ideal_menos: formData.preco_ideal_menos || null,
      };

      // **Chama useInserirPesquisa**
      await mutacaoPesquisa.mutateAsync(dadosPesquisa);

      // Sucesso total
      console.log('Usuário e Pesquisa inseridos com sucesso!');
      onClose(); // Fecha o modal após o sucesso

    } catch (error) {
      // Tratar erros de qualquer uma das mutações
      console.error('Erro ao inserir Usuário ou Pesquisa:', error);
      alert('Ocorreu um erro ao salvar os dados. Verifique o console para mais detalhes.');
    }
  };

  const isSaving = mutacaoUsuario.isPending || mutacaoPesquisa.isPending;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <header className="modal-header">
          <h2>Adicionar Novo Usuário e Pesquisa</h2>
          <button onClick={onClose} className="modal-close-btn" disabled={isSaving}>
            <FaTimes />
          </button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit}>
          
          {/* ========================================================================= */}
          {/* SEÇÃO USUÁRIO - CAMPOS PESSOAIS BÁSICOS */}
          {/* ========================================================================= */}
          <h3>Dados Pessoais e de Acesso</h3>
          <div className="modal-form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input 
              type="text" 
              id="nome" 
              name="nome" 
              value={formData.nome} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="senha">Senha</label>
            <input 
              type="password" 
              id="senha" 
              name="senha" 
              value={formData.senha} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Grid para Endereço */}
          <div className="modal-address-grid">
            <div className="modal-form-group">
              <label htmlFor="rua">Rua</label>
              <input 
                type="text" 
                id="rua" 
                name="rua" 
                value={formData.rua} 
                onChange={handleChange} 
              />
            </div>
            <div className="modal-form-group">
              <label htmlFor="bairro">Bairro</label>
              <input 
                type="text" 
                id="bairro" 
                name="bairro" 
                value={formData.bairro} 
                onChange={handleChange} 
              />
            </div>
            <div className="modal-form-group">
              <label htmlFor="numero">Número</label>
              <input 
                type="number" 
                id="numero" 
                name="numero" 
                value={formData.numero} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SEÇÃO PESQUISA - NOVOS CAMPOS ADICIONADOS COM BASE NO SQL */}
          {/* ========================================================================= */}
          <h3 style={{ marginTop: '30px' }}>Pesquisa de Streaming</h3>

          {/* CAMPO: Ocupação (Select) */}
          <div className="modal-form-group">
            <label htmlFor="ocupacao">Ocupação</label>
            <select
              id="ocupacao"
              name="ocupacao"
              value={formData.ocupacao}
              onChange={handleChange}
              required
            >
              <option value="">Selecione sua ocupação</option>
              <option value="Estudante">Estudante</option>
              <option value="CLT">CLT</option>
              <option value="Autônomo(a)">Autônomo(a)</option>
              <option value="Servidor público">Servidor público</option>
              <option value="Integrante de empresa júnior">Integrante de empresa júnior</option>
              {/* Adicione outras opções conforme necessário */}
            </select>
          </div>

          {/* CAMPO: Região de Residência (Select) */}
          <div className="modal-form-group">
            <label htmlFor="regiao_residencia">Região de Residência</label>
            <select
              id="regiao_residencia"
              name="regiao_residencia"
              value={formData.regiao_residencia}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a região</option>
              <option value="Região Nordeste">Região Nordeste</option>
              <option value="Região Sul">Região Sul</option>
              <option value="Estados Unidos">Estados Unidos</option>
              {/* Adicione outras regiões se existirem */}
            </select>
          </div>

          {/* CAMPO: Gênero (Radio Group - Mantido com o nome 'genero') */}
          <div className="modal-form-group">
            <label>Gênero</label>
            <div className="modal-radio-group">
              <label>
                <input 
                  type="radio" 
                  name="genero" 
                  value="Masculino" 
                  checked={formData.genero === 'Masculino'}
                  onChange={handleChange}
                  required
                /> Masculino
              </label>
              <label>
                <input 
                  type="radio" 
                  name="genero" 
                  value="Feminino" 
                  checked={formData.genero === 'Feminino'}
                  onChange={handleChange}
                /> Feminino
              </label>
            </div>
          </div>

          {/* CAMPO: Faixa Etária (Select) */}
          <div className="modal-form-group">
            <label htmlFor="faixa_etaria">Faixa Etária</label>
            <select
              id="faixa_etaria"
              name="faixa_etaria"
              value={formData.faixa_etaria}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a faixa etária</option>
              <option value="Entre 18 e 30 anos">Entre 18 e 30 anos</option>
              <option value="Entre 30 e 50 anos">Entre 30 e 50 anos</option>
              <option value="Entre 50 e 70 anos">Entre 50 e 70 anos</option>
            </select>
          </div>

          {/* CAMPO: Qtd Assinaturas (Select) */}
          <div className="modal-form-group">
            <label htmlFor="qtd_assinaturas">Quantidade de Assinaturas (número)</label>
            <select
              id="qtd_assinaturas"
              name="qtd_assinaturas"
              value={formData.qtd_assinaturas}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a quantidade</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4 a 5</option>
              <option value="6">6 ou mais</option>
            </select>
          </div>
          
          {/* CAMPO: Serviços Utilizados (Checkboxes) */}
          <div className="modal-form-group">
            <label>Serviços Utilizados (Pode selecionar vários)</label>
            <div className="modal-checkbox-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {['Netflix', 'Amazon Prime Video', 'Disney+', 'HBO Max', 'Globo play', 'Apple TV', 'Paramount Plus', 'Crunchyroll'].map((service) => (
                <label key={service}>
                  <input
                    type="checkbox"
                    name="servicos_utilizados"
                    value={service}
                    checked={formData.servicos_utilizados.includes(service)}
                    onChange={handleMultiChange}
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>
          
          {/* CAMPO: Motivo Insatisfação (Checkboxes) */}
          <div className="modal-form-group">
            <label>Motivos de Insatisfação</label>
            <div className="modal-checkbox-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {[
                'Títulos dessinteressantes', 
                'Falta de produções originais de qualidade', 
                'Limitação de telas', 
                'Conteúdo limitado ou repetitivo', 
                'Preço elevado', 
                'Propagandas', 
                'Falta de atualização',
                'Outros'
              ].map((motivo) => (
                <label key={motivo}>
                  <input
                    type="checkbox"
                    name="motivo_insatisfacao"
                    value={motivo}
                    checked={formData.motivo_insatisfacao.includes(motivo)}
                    onChange={handleMultiChange}
                  />
                  {motivo}
                </label>
              ))}
            </div>
          </div>
          
          {/* CAMPO: Gêneros Assistidos (Checkboxes) */}
          <div className="modal-form-group">
            <label>Gêneros Assistidos</label>
            <div className="modal-checkbox-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {[
                'Ação', 'Comédia', 'Drama', 'Documentário', 'Romance', 
                'Ficção Científica', 'Terror', 'Animação', 'Outros'
              ].map((genero) => (
                <label key={genero}>
                  <input
                    type="checkbox"
                    name="generos_assistidos"
                    value={genero}
                    checked={formData.generos_assistidos.includes(genero)}
                    onChange={handleMultiChange}
                  />
                  {genero}
                </label>
              ))}
            </div>
          </div>

          {/* CAMPO: Frequência de Uso (Select) */}
          <div className="modal-form-group">
            <label htmlFor="frequencia_uso">Frequência de Uso</label>
            <select
              id="frequencia_uso"
              name="frequencia_uso"
              value={formData.frequencia_uso}
              onChange={handleChange}
            >
              <option value="">Selecione a frequência</option>
              <option value="Diariamente">Diariamente</option>
              <option value="Semanalmente">Semanalmente</option>
              <option value="Mensalmente">Mensalmente</option>
              <option value="Raramente">Raramente</option>
            </select>
          </div>

          {/* CAMPO: Horas Semanais (Select) */}
          <div className="modal-form-group">
            <label htmlFor="horas_semanais">Horas Semanais de Uso</label>
            <select
              id="horas_semanais"
              name="horas_semanais"
              value={formData.horas_semanais}
              onChange={handleChange}
            >
              <option value="">Selecione a estimativa</option>
              <option value="Até 2 horas">Até 2 horas</option>
              <option value="Até 4 horas">Até 4 horas</option>
              <option value="Mais que 4 horas">Mais que 4 horas</option>
              <option value="Raramente">Raramente</option>
            </select>
          </div>

          {/* CAMPO: Dispositivos Utilizados (Checkboxes) */}
          <div className="modal-form-group">
            <label>Dispositivos Utilizados</label>
            <div className="modal-checkbox-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {[
                'TV', 'Smartphone', 'Computador/Notebook', 'Tablet',
                'Dispositivo de streaming (Ex: Chromecast, Fire TV Stick)'
              ].map((device) => (
                <label key={device}>
                  <input
                    type="checkbox"
                    name="dispositivos_utilizados"
                    value={device}
                    checked={formData.dispositivos_utilizados.includes(device)}
                    onChange={handleMultiChange}
                  />
                  {device}
                </label>
              ))}
            </div>
          </div>
          
          {/* CAMPOS DE SATISFAÇÃO (Números 1-5) */}
          <div className="modal-address-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="modal-form-group">
              <label htmlFor="satisfacao_geral">Satisfação Geral (1-5)</label>
              <input 
                type="number" 
                id="satisfacao_geral" 
                name="satisfacao_geral" 
                min="1" 
                max="5" 
                value={formData.satisfacao_geral} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="modal-form-group">
              <label htmlFor="satisfacao_recomendacao">Satisfação Recomendação (1-5)</label>
              <input 
                type="number" 
                id="satisfacao_recomendacao" 
                name="satisfacao_recomendacao" 
                min="1" 
                max="5" 
                value={formData.satisfacao_recomendacao} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* CAMPO: Preço Ideal (Select) */}
          <div className="modal-form-group">
            <label htmlFor="preco_ideal_menos">Preço Ideal</label>
            <select
              id="preco_ideal_menos"
              name="preco_ideal_menos"
              value={formData.preco_ideal_menos}
              onChange={handleChange}
            >
              <option value="">Selecione a faixa de preço</option>
              <option value="Até R$15,00">Até R$15,00</option>
              <option value="Entre R$15,00 e R$30,00">Entre R$15,00 e R$30,00</option>
              <option value="Entre R$30,00 e R$50,00">Entre R$30,00 e R$50,00</option>
              <option value="Acima de R$50,00">Acima de R$50,00</option>
            </select>
          </div>

          {/* Indicador de Carregamento/Erro */}
          {(mutacaoUsuario.isPending || mutacaoPesquisa.isPending) && (
            <p className="modal-status-message">Salvando dados...</p>
          )}
          {mutacaoUsuario.isError && (
            <p className="modal-error-message">Erro ao criar usuário: {mutacaoUsuario.error.message}</p>
          )}
          {mutacaoPesquisa.isError && (
            <p className="modal-error-message">Erro ao salvar pesquisa: {mutacaoPesquisa.error.message}</p>
          )}

          {/* Botões do Rodapé */}
          <footer className="modal-footer">
            <button 
              type="button" 
              className="modal-btn modal-btn-secondary" 
              onClick={onClose} 
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="modal-btn modal-btn-primary" 
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar Usuário e Pesquisa'}
            </button>
          </footer>

        </form>
      </div>
    </div>
  );
}

export default InserirUsuarioPesquisa;