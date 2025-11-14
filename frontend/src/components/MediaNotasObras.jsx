import React, { useState } from "react";
import { MediaNotasObrasChart } from "./MediaNotasObrasChart";
import { Search, XCircle } from "lucide-react";

export const MediaNotasObras = () => {
  const [obraCodigo, setObraCodigo] = useState("");
  const [filtro, setFiltro] = useState(null);

  const handleBuscar = (e) => {
    e.preventDefault();
    // Se o campo estiver vazio, mostra todas as obras
    if (obraCodigo.trim() === "") {
      setFiltro(null);
    } else {
      setFiltro(obraCodigo.trim());
    }
  };

  const limparFiltro = () => {
    setObraCodigo("");
    setFiltro(null);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow-md max-w-4xl mx-auto">
      <h2>Médias das Notas por Obra</h2>

      <form onSubmit={handleBuscar} className="flex items-center justify-center mb-6 gap-2">
        <input
          type="number"
          placeholder="Digite o ID da obra..."
          value={obraCodigo}
          onChange={(e) => setObraCodigo(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          Buscar
        </button>

        {filtro && (
          <button
            type="button"
            onClick={limparFiltro}
            className="ml-2 flex items-center gap-1 text-red-500 hover:text-red-700"
          >
            <XCircle size={18} /> Limpar
          </button>
        )}
      </form>

      {/* Passa o filtro (ou null) para o gráfico */}
      <MediaNotasObrasChart obraCodigo={filtro} />
    </div>
  );
};
