import React, { useState, useEffect } from 'react';
import { CircleUserRound, Loader2 } from 'lucide-react';

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função assíncrona para buscar os dados da API
    const fetchUsuarios = async () => {
      try {
        // Faz a chamada GET para o endpoint /api/usuarios.
        // O caminho da URL pode ser relativo, já que o proxy do Vite
        // ou a mesma origem do servidor irá direcionar a requisição.
        const response = await fetch('/api/usuarios');

        // Verifica se a resposta foi bem-sucedida (status 200-299)
        if (!response.ok) {
          throw new Error(`Erro de rede: ${response.statusText}`);
        }

        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        // Captura e armazena o erro para ser exibido
        setError(err.message);
      } finally {
        // Define o estado de carregamento como false, independentemente do sucesso ou falha
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []); // O array vazio de dependências garante que o efeito só rode uma vez, ao montar o componente.

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="mt-4 text-lg font-medium">Carregando usuários...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
            <p className="font-bold">Erro ao buscar os dados:</p>
            <p>{error}</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Lista de Usuários</h1>

          {usuarios.length > 0 ? (
              <ul className="space-y-4">
                {usuarios.map((usuario) => (
                    <li
                        key={usuario.id}
                        className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <CircleUserRound className="h-8 w-8 text-blue-500" />
                      <span className="text-lg font-medium text-gray-700">{usuario.nome}</span>
                    </li>
                ))}
              </ul>
          ) : (
              <div className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-xl">
                <p className="text-xl font-semibold">Nenhum usuário encontrado.</p>
              </div>
          )}
        </div>
      </div>
  );
}
