import React, { useState, useEffect } from 'react';
import { BookOpen, AlertTriangle, Loader2 } from 'lucide-react'; // Ícones modernos

// Definindo uma estrutura de tipo mock para as obras que esperamos receber
// Em um ambiente real com TypeScript, usaríamos interfaces/tipos.

/**
 * Componente principal da aplicação que busca e exibe uma lista de obras
 * a partir do endpoint /api/obras do backend.
 */
const App = () => {
    // Estado para armazenar a lista de obras
    const [obras, setObras] = useState([]);
    // Estado para controlar o estado de carregamento
    const [isLoading, setIsLoading] = useState(true);
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState(null);

    // URL da API. Se o seu backend estiver em um domínio/porta diferente,
    // você deve substituir esta URL (ex: 'http://localhost:8080/api/obras').
    const API_URL = 'http://localhost:8080/api/obras';

    useEffect(() => {
        const fetchObras = async () => {
            // Reinicia os estados de erro e carregamento
            setError(null);
            setIsLoading(true);

            try {
                const response = await fetch(API_URL);

                // Verifica se a resposta HTTP foi bem-sucedida (status 200-299)
                if (!response.ok) {
                    throw new Error(`Erro ao buscar dados: Status ${response.status}`);
                }

                const data = await response.json();

                // Simulação de delay para visualização do estado de carregamento
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Armazena os dados no estado, assumindo que data é um Array de Obra
                setObras(data);

            } catch (err) {
                console.error("Falha ao carregar obras:", err);
                // Exibe uma mensagem de erro amigável.
                setError(`Não foi possível conectar ou processar os dados. Detalhe: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchObras();
    }, []); // O array de dependências vazio garante que o fetch ocorra apenas uma vez ao montar o componente

    // --- Funções de Renderização de Estado ---

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700">Carregando Obras...</p>
            <p className="text-sm text-gray-500 mt-1">Estamos buscando os dados do seu backend em ${API_URL}</p>
        </div>
    );

    const renderError = () => (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-xl shadow-lg border border-red-300">
            <AlertTriangle className="w-10 h-10 text-red-600 mb-4" />
            <p className="text-xl font-semibold text-red-800 mb-2">Erro na Requisição</p>
            <p className="text-center text-red-700 max-w-md">{error}</p>
        </div>
    );

    const renderObras = () => (
        <>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">
                <BookOpen className="inline-block w-6 h-6 mr-3 text-indigo-600"/>
                Obras Encontradas ({obras.length})
            </h2>

            {obras.length === 0 ? (
                <div className="text-center p-10 bg-yellow-50 rounded-xl">
                    <p className="text-lg font-medium text-yellow-800">Nenhuma obra foi retornada pela API.</p>
                    <p className="text-sm text-yellow-600 mt-2">Verifique se o seu serviço está retornando dados.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {obras.map((obra, index) => (
                        // Assumimos que cada objeto 'obra' tem uma propriedade 'id' ou usamos o índice
                        <div
                            key={obra.id || index}
                            className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300 border-l-4 border-indigo-500"
                        >
                            <p className="text-xs font-semibold text-indigo-600 mb-1">ID: {obra.id || 'N/A'}</p>

                            {/* Tentativa de exibir um campo comum, como 'titulo' ou 'nome' */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {obra.titulo || obra.nome || 'Obra sem Título'}
                            </h3>

                            {/* Tentativa de exibir um segundo campo, como 'autor' ou 'descricao' */}
                            <p className="text-gray-600 text-sm">
                                {obra.autor ? `Autor: ${obra.autor}` : ''}
                                {obra.descricao ? obra.descricao.substring(0, 100) + '...' : ''}
                            </p>

                            {/* Se você precisar exibir o objeto inteiro para debug: */}
                            {/* <pre className="mt-3 text-xs bg-gray-50 p-2 rounded overflow-auto">
                {JSON.stringify(obra, null, 2)}
              </pre> */}
                        </div>
                    ))}
                </div>
            )}
        </>
    );


    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-indigo-700">
                    Aplicação de Consulta de Obras
                </h1>
                <p className="text-gray-500 mt-2">
                    Chamando a API do Backend: <code className="bg-gray-200 px-2 py-1 rounded text-sm">{API_URL}</code>
                </p>
            </header>

            <main className="max-w-6xl mx-auto">
                {isLoading && renderLoading()}
                {error && renderError()}
                {!isLoading && !error && renderObras()}
            </main>

            <footer className="mt-10 pt-4 text-center text-gray-500 text-sm border-t">
                Desenvolvido com React e Tailwind CSS.
            </footer>
        </div>
    );
};

export default App;
