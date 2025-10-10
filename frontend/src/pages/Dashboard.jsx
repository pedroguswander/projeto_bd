import React, { useEffect, useRef } from 'react';
// Importação do Bootstrap CSS (necessário em um projeto React real)
import 'bootstrap/dist/css/bootstrap.min.css';

// Importa as bibliotecas do Chart.js instaladas via npm
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// O ChartDataLabels deve ser registrado globalmente uma vez
Chart.register(ChartDataLabels);

// --- Estilos CSS Customizados convertidos para um objeto JavaScript ---
const customStyles = {
    body: {
        fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        margin: 0,
        padding: '20px 0',
        boxSizing: 'border-box',
        color: '#333',
    },
    dashboardContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '25px',
        width: '90%',
        maxWidth: '900px',
        marginBottom: '30px',
    },
    smallChartContainer: {
        maxWidth: '450px',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
};

// --- Função principal do componente Dashboard ---
const Dashboard = () => {
    // 1. Criar Refs para cada elemento <canvas>
    const graficoSatisfacaoRef = useRef(null);
    const graficoGenerosPorDispositivoRef = useRef(null);
    const graficoGenerosPorSexoRef = useRef(null);
    const graficoStreamingsPorHorasRef = useRef(null);
    const graficoGenerosPorServicosRef = useRef(null);
    const graficoFaixaEtariaRef = useRef(null);
    const graficoGeneroRef = useRef(null);
    const graficoUsoTelaRef = useRef(null);

    // 2. O hook useEffect executa o código do Chart.js após a renderização do componente
    useEffect(() => {
        // --- Definições de Dados e Configurações de Gráficos (Copie do seu script) ---
        // ... TODAS as suas constantes (satisfacaoLabels, configSatisfacao, etc.)
        // devem ser definidas aqui dentro ou importadas de um arquivo de dados/config.

        // Por brevidade e para manter o foco na conversão, definiremos apenas uma config aqui
        // e você deve replicar as demais.

        // 1. Configuração do Nível de Satisfação (Exemplo)
        const satisfacaoLabels = ['Feminino', 'Masculino'];
        const dadosValoresSatisfacao = [3.45, 3.7];
        const corSatisfacao = 'rgba(173, 216, 230, 0.8)';
        const bordaSatisfacao = 'rgb(173, 216, 230)';

        const configSatisfacao = {
            type: 'bar',
            data: {
                labels: satisfacaoLabels,
                datasets: [{
                    label: 'Nível de satisfação',
                    data: dadosValoresSatisfacao,
                    backgroundColor: corSatisfacao,
                    borderColor: bordaSatisfacao,
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                // ... (Inclua o resto das opções do seu gráfico de satisfação)
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4.5,
                        // ...
                    },
                    x: {
                        // ...
                    }
                },
                plugins: {
                    legend: {
                        // ...
                    },
                    datalabels: {
                        // ...
                    }
                }
            }
        };

        // 2. Configurações dos Outros Gráficos (a serem replicadas por você)
        // Você deve definir aqui:
        // configGenerosPorDispositivo
        // configGenerosPorSexo
        // configStreamingsPorHoras
        // configGenerosPorServicos
        // configFaixasEtarias
        // configGeneros
        // configUsoTela

        // Exemplo: Dados para o Gráfico de Faixa Etária
        const faixasEtariasLabels = ['Entre 18 e 30 anos', 'Entre 30 e 50 anos', 'Entre 50 e 70 anos'];
        const faixasEtariasData = [82.8, 6.9, 10.3];
        const faixasEtariasCores = ['#4269e8', '#5cb85c', '#ef4444'];

        const configFaixasEtarias = {
            type: 'pie',
            data: {
                labels: faixasEtariasLabels,
                datasets: [{
                    data: faixasEtariasData,
                    backgroundColor: faixasEtariasCores,
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                // ... o resto das opções
                responsive: true,
                plugins: {
                    legend: { display: true },
                    datalabels: {
                        color: '#ffffff',
                        font: { weight: 'bold', size: 14 },
                        formatter: (value) => value.toFixed(1) + '%',
                    }
                }
            }
        };

        // --- Inicialização dos Gráficos (garantindo que o elemento existe) ---

        // Armazena as instâncias do Chart para limpeza
        const charts = [];

        if (graficoSatisfacaoRef.current) {
            charts.push(new Chart(graficoSatisfacaoRef.current, configSatisfacao));
        }

        if (graficoGenerosPorDispositivoRef.current) {
            // Crie e configure o gráfico 2 (configGenerosPorDispositivo)
            // charts.push(new Chart(graficoGenerosPorDispositivoRef.current, configGenerosPorDispositivo));
        }

        // ... Repita para todos os outros gráficos, usando a Ref e Config corretas

        if (graficoFaixaEtariaRef.current) {
            charts.push(new Chart(graficoFaixaEtariaRef.current, configFaixasEtarias));
        }

        // ... (Adicione a inicialização para os 5 gráficos restantes)

        // 3. Função de Limpeza (Cleanup)
        // Retorna uma função que destrói os gráficos quando o componente é desmontado
        return () => {
            charts.forEach(chart => {
                if (chart) {
                    chart.destroy();
                }
            });
        };
    }, []); // O array de dependências vazio ([]) garante que isso execute apenas uma vez (na montagem)

    return (
        <div style={customStyles.body}>
            {/* O React não usa a tag <style> para CSS dinâmico como no HTML puro,
                então usamos o atributo 'style' com o objeto customStyles. */}

            <div className="dashboard-container" style={customStyles.dashboardContainer}>
                <h2 style={customStyles.heading}>Nível de Satisfação de Streaming por Gênero</h2>
                <canvas ref={graficoSatisfacaoRef}></canvas> {/* Uso da Ref */}
            </div>

            <div className="dashboard-container" style={customStyles.dashboardContainer}>
                <h2 style={customStyles.heading}>Consumo de Gêneros por Dispositivo</h2>
                <canvas ref={graficoGenerosPorDispositivoRef}></canvas>
            </div>

            <div className="dashboard-container" style={customStyles.dashboardContainer}>
                <h2 style={customStyles.heading}>Total de Pessoas por Gênero e Sexo</h2>
                <canvas ref={graficoGenerosPorSexoRef}></canvas>
            </div>

            <div className="dashboard-container" style={customStyles.dashboardContainer}>
                <h2 style={customStyles.heading}>Streamings Usados por Horas Assistidas</h2>
                <canvas ref={graficoStreamingsPorHorasRef}></canvas>
            </div>

            <div className="dashboard-container" style={customStyles.dashboardContainer}>
                <h2 style={customStyles.heading}>Relação entre Gêneros de Filmes/Séries e Serviços de Streaming</h2>
                <canvas ref={graficoGenerosPorServicosRef}></canvas>
            </div>

            <div className="dashboard-container small-chart-container" style={{ ...customStyles.dashboardContainer, ...customStyles.smallChartContainer }}>
                <h2 style={customStyles.heading}>Análise da Distribuição por Faixa Etária</h2>
                <canvas ref={graficoFaixaEtariaRef}></canvas>
            </div>

            <div className="dashboard-container small-chart-container" style={{ ...customStyles.dashboardContainer, ...customStyles.smallChartContainer }}>
                <h2 style={customStyles.heading}>Análise da Distribuição por Gênero</h2>
                <canvas ref={graficoGeneroRef}></canvas>
            </div>

            <div className="dashboard-container small-chart-container" style={{ ...customStyles.dashboardContainer, ...customStyles.smallChartContainer }}>
                <h2 style={customStyles.heading}>Análise da Distribuição de uso de tela (semanal)</h2>
                <canvas ref={graficoUsoTelaRef}></canvas>
            </div>

            {/* O JavaScript do Bootstrap não é estritamente necessário para um dashboard de exibição.
                Se fosse necessário, ele seria importado no index.js ou integrado via pacote npm. */}
        </div>
    );
}

export default Dashboard;