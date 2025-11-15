// src/hooks/usePlanoData.js

import { useQuery } from '@tanstack/react-query'; // Importa useQuery
import axios from 'axios'; // Importa axios

// --- Mapeamentos de Configuração (Constantes) ---

// 1. Mapeamento dos nomes de métricas (chaves do JSON) para rótulos legíveis no gráfico
const METRIC_LABELS = {
    'media_horas_por_usuario': 'Média de Horas por Usuário',
    'satisfacao_geral_pesquisa': 'Satisfação Geral',
    'indice_reclamacao_por_usuario': 'Índice de Reclamação',
    'preco_relativo': 'Preço Relativo',
    'telas_simultaneas': 'Telas Simultâneas',
};

// 2. Cores para os planos (consistência visual)
const PLAN_COLORS = {
    'Básico com Anúncios': 'rgba(255, 165, 0, 1)',  // Laranja
    'Família 4K': 'rgba(54, 162, 235, 1)',        // Azul
    'Padrão': 'rgba(75, 192, 192, 1)',            // Verde
    'Premium HD': 'rgba(255, 99, 132, 1)',        // Vermelho
};

// URL do seu Controller
const API_URL = 'http://localhost:8080/api/planos/analise-valor'; 

// --- Função de Fetch ---

/**
 * Função assíncrona para buscar os dados normalizados do plano.
 * @returns {Promise<Array<Object>>} Os dados brutos do endpoint.
 */
const fetchPlanoData = async () => {
    const response = await axios.get(API_URL); 
    return response.data;
};

// --- Hook Customizado (CORRIGIDO) ---

/**
 * Hook para buscar dados dos planos e formatá-los para o Chart.js.
 * @returns O objeto de resultado do useQuery (data, isLoading, isError, etc.).
 */
export function usePlanoData() {
    // CORREÇÃO: useQuery agora recebe um único objeto de configuração {}
    return useQuery({
        // queryKey é a chave de cache e deve ser um Array no v5
        queryKey: ['analisePlanos'], 
        
        // queryFn é a função de fetch (Executor)
        queryFn: fetchPlanoData, 
        
        // O seletor (select) e outras opções permanecem dentro do objeto
        select: (rawData) => {
            if (!rawData || rawData.length === 0) {
                return { labels: [], datasets: [] };
            }
            
            // 1. Determina os rótulos do gráfico (eixos)
            // Filtra 'plano' e usa as demais chaves como métricas
            const metricKeys = Object.keys(rawData[0]).filter(key => key !== 'plano');
            const labels = metricKeys.map(key => METRIC_LABELS[key] || key);

            // 2. Mapeia cada plano para um dataset do Chart.js
            const datasets = rawData.map(planoData => {
                const planoName = planoData.plano;
                const color = PLAN_COLORS[planoName] || 'rgba(0, 0, 0, 1)'; // Cor padrão

                return {
                    label: planoName,
                    // Os valores das métricas na ordem correta
                    data: metricKeys.map(key => planoData[key]),
                    fill: true,
                    backgroundColor: color.replace('1)', '0.2)'), // Fundo com 20% de opacidade
                    borderColor: color, // Cor da linha
                    pointBackgroundColor: color,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: color
                };
            });

            // 3. Retorna o objeto formatado para o Chart.js
            return { labels, datasets };
        },
    });
}