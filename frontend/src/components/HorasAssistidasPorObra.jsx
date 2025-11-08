import { useBuscarObra }  from "../hooks/useBuscarObra";
import { useMetricasObra } from "../hooks/useMetricasObra";
import { Search, Clock, Users, Loader2, XCircle, Film } from 'lucide-react';
import React, { useState } from 'react';
import './HorasAssistidasPorObra.css';



export const HorasAssistidasPorObra = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [queryTerm, setQueryTerm] = useState('');

  // Hook 1: Buscar Obra
  const { 
    data: obra, 
    isLoading: isLoadingObra, 
    isError: isErrorObra,
    isFetching: isFetchingObra,
  } = useBuscarObra(queryTerm);
  
  const codigoObra = obra?.codigo;
  
  // Hook 2: Buscar Métricas
  const { 
    data: metricas, 
    isLoading: isLoadingMetricas, 
    isError: isErrorMetricas,
    isFetching: isFetchingMetricas,
  } = useMetricasObra(codigoObra);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setQueryTerm(searchTerm.trim());
    }
  };
  
  const formatNumber = (num) => {
      if (typeof num !== 'number') return '0';
      return new Intl.NumberFormat('pt-BR', { 
          maximumFractionDigits: 2 
      }).format(num);
  };
  
  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      // Ajuste para garantir que a data seja interpretada corretamente como UTC
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('pt-BR');
  };
  
  const isLoading = isLoadingObra || isFetchingObra || isLoadingMetricas || isFetchingMetricas;

  return (
    <div className="analisador-container">
      <div className="conteudo-central">
        <h1 className="titulo-principal">
          <Film className="icone-titulo" />
          Analisador de Obras
        </h1>
        
        {/* Formulário de Busca */}
        <form onSubmit={handleSearch} className="formulario-busca">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar obra por nome (ex: Cidade de Deus 2)"
            className="input-busca"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="botao-busca"
          >
            {isLoading ? (
                <Loader2 className="icone-spin" />
            ) : (
                <Search className="icone-busca" />
            )}
          </button>
        </form>

        {/* Área de Conteúdo (Resultados) */}
        <div className="area-resultados">
          {/* Estado de Carregamento */}
          {isLoading && !obra && (
            <div className="estado-mensagem loading-msg">
              <Loader2 className="icone-grande icone-spin" />
              <span>Buscando dados...</span>
            </div>
          )}

          {/* Estado de Erro - Obra não encontrada */}
          {isErrorObra && queryTerm && (
            <div className="estado-mensagem erro-card">
              <XCircle className="icone-grande" />
              <span className="erro-titulo">Obra não encontrada</span>
              <p className="erro-descricao">Não foi possível encontrar uma obra com o nome "{queryTerm}". Tente novamente.</p>
            </div>
          )}
          
          {/* Estado de Erro - Métricas falharam */}
          {isErrorMetricas && !isErrorObra && obra && (
             <div className="estado-mensagem aviso-card">
              <XCircle className="icone-grande" />
              <span className="erro-titulo">Erro nas Métricas</span>
              <p className="erro-descricao">A obra "{obra.nome}" foi encontrada, mas não foi possível carregar as métricas.</p>
            </div>
          )}

          {/* Estado de Sucesso - Card de Métricas */}
          {!isErrorObra && obra && !isErrorMetricas && metricas && (
            <div className="card-metricas">
              {/* Cabeçalho do Card */}
              <div className="card-cabecalho">
                <h2 className="nome-obra">{obra.nome}</h2>
                <p className="sinopse-obra">{obra.sinopse}</p>
              </div>
              
              {/* Corpo de Métricas */}
              <div className="corpo-metricas">
                {/* Métrica 1: Horas Assistidas */}
                <div className="item-metrica">
                  <Clock className="icone-metrica" />
                  <div>
                    <span className="titulo-metrica">Total de Horas Assistidas</span>
                    <p className="valor-metrica">
                      {formatNumber(metricas.totalHorasAssistidas)}
                    </p>
                  </div>
                </div>
                
                {/* Métrica 2: Contas */}
                <div className="item-metrica">
                  <Users className="icone-metrica" />
                  <div>
                    <span className="titulo-metrica">Total de Contas</span>
                    <p className="valor-metrica">
                      {formatNumber(metricas.totalContasAssistindo)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Rodapé do Card (Informações Extras) */}
              <div className="card-rodape">
                <span>Lançamento: {formatDate(obra.dataLancamento)}</span>
                <span>Duração: {obra.duracao}</span>
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
};