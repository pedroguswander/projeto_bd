import { useBuscarObra }  from "../hooks/useBuscarObra";
import { useMetricasObra } from "../hooks/useMetricasObra";
import { Search, Clock, Users, Loader2, XCircle, Film } from 'lucide-react';
import React, { useState } from 'react';


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
      
      {/* --- ESTILOS CSS PERSONALIZADOS --- */}
      <style>{`
        /* Variáveis de Cores */
        :root {
            --cor-fundo: #111827; /* gray-900 */
            --cor-card-fundo: #1f2937; /* gray-800 */
            --cor-card-secundaria: #374151; /* gray-700 */
            --cor-primaria: #60a5fa; /* blue-400 */
            --cor-texto: #ffffff;
            --cor-texto-secundario: #d1d5db; /* gray-300 */
            --cor-erro: #f87171; /* red-400 */
            --cor-aviso: #facc15; /* yellow-400 */
            --sombra-card: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Container Principal */
        .analisador-container {
            background-color: var(--cor-fundo);
            color: var(--cor-texto);
            min-height: 100vh;
            padding: 24px; /* p-6 */
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }
        
        /* Centralização e Largura */
        .conteudo-central {
            max-width: 768px; /* max-w-3xl */
            margin-left: auto;
            margin-right: auto;
        }

        /* Título */
        .titulo-principal {
            font-size: 2.25rem; /* 4xl */
            font-weight: 700; /* bold */
            text-align: center;
            margin-bottom: 32px; /* mb-8 */
            color: var(--cor-primaria);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px; /* gap-3 */
        }
        .icone-titulo {
            width: 40px;
            height: 40px;
        }

        /* Formulário de Busca */
        .formulario-busca {
            display: flex;
            margin-bottom: 24px;
            box-shadow: var(--sombra-card);
            border-radius: 8px;
            overflow: hidden;
        }

        .input-busca {
            flex-grow: 1;
            padding: 16px;
            background-color: var(--cor-card-secundaria);
            border: 1px solid #4b5563; /* gray-600 */
            color: var(--cor-texto);
            font-size: 16px;
            outline: none;
            transition: border-color 0.3s, box-shadow 0.3s;
        }
        .input-busca::placeholder {
            color: #9ca3af; /* gray-400 */
        }
        .input-busca:focus {
            border-color: var(--cor-primaria);
            box-shadow: 0 0 0 2px var(--cor-primaria);
        }

        .botao-busca {
            padding: 16px;
            background-color: #3b82f6; /* blue-600 */
            color: var(--cor-texto);
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
        }
        .botao-busca:hover:not(:disabled) {
            background-color: #2563eb; /* blue-700 */
        }
        .botao-busca:disabled {
            background-color: #6b7280; /* gray-500 */
            cursor: not-allowed;
        }

        /* Ícones */
        .icone-spin {
            animation: spin 1s linear infinite;
        }
        .icone-grande {
            width: 48px;
            height: 48px;
        }

        /* Área de Resultados */
        .area-resultados {
            margin-top: 32px;
            min-height: 300px;
        }

        /* Mensagens de Estado (Loading/Erro) */
        .estado-mensagem {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 16px;
            padding: 64px 24px;
            text-align: center;
            border-radius: 8px;
        }
        .loading-msg {
            color: var(--cor-primaria);
        }
        .erro-card {
            background-color: rgba(153, 27, 27, 0.2); /* red-900/20 */
            color: var(--cor-erro);
            border: 1px solid var(--cor-erro);
        }
        .aviso-card {
            background-color: rgba(146, 64, 14, 0.2);
            color: var(--cor-aviso);
            border: 1px solid var(--cor-aviso);
        }
        .erro-titulo {
            font-size: 1.125rem; /* lg */
            font-weight: 600;
        }
        .erro-descricao {
            color: var(--cor-texto-secundario);
        }

        /* Card de Métricas */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-metricas {
            background-color: var(--cor-card-fundo);
            border-radius: 16px; /* rounded-2xl */
            box-shadow: var(--sombra-card);
            overflow: hidden;
            animation: fade-in 0.5s ease-out;
        }

        /* Cabeçalho do Card */
        .card-cabecalho {
            padding: 32px;
        }
        .nome-obra {
            font-size: 2.25rem; /* 4xl */
            font-weight: 800; /* extabold */
            color: var(--cor-texto);
            margin-bottom: 8px;
        }
        .sinopse-obra {
            color: var(--cor-texto-secundario);
            font-size: 1rem;
        }

        /* Corpo de Métricas */
        .corpo-metricas {
            background-color: var(--cor-card-secundaria);
            padding: 32px;
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
            border-top: 1px solid var(--cor-fundo);
        }
        
        @media (min-width: 768px) {
            .corpo-metricas {
                grid-template-columns: 1fr 1fr;
            }
        }

        .item-metrica {
            display: flex;
            align-items: center;
            gap: 24px;
            background-color: rgba(31, 41, 55, 0.5); /* gray-800/50 */
            padding: 24px;
            border-radius: 8px;
            border: 1px solid #374151;
        }

        .icone-metrica {
            width: 48px;
            height: 48px;
            color: var(--cor-primaria);
            flex-shrink: 0;
        }
        .titulo-metrica {
            font-size: 0.875rem; /* sm */
            color: var(--cor-texto-secundario);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: block;
        }
        .valor-metrica {
            font-size: 2.25rem; /* 4xl */
            font-weight: 800;
            color: var(--cor-texto);
            line-height: 1.1;
        }

        /* Rodapé do Card */
        .card-rodape {
            padding: 24px;
            background-color: var(--cor-card-fundo);
            border-top: 1px solid #374151; /* gray-700 */
            font-size: 0.875rem; /* sm */
            color: #9ca3af; /* gray-400 */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 8px;
        }
        
        @media (min-width: 768px) {
            .card-rodape {
                flex-direction: row;
            }
        }


        /* Animação de Spin */
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};