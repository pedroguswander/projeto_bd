import React, { useState } from "react";
import useBuscarObra from "../hooks/useBuscarObraPalavraChave";
import "./BuscarObraPalavraChave.css";

export default function BuscarObraPalavraChave() {
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useBuscarObra(searchTerm);

  function onSubmit(e) {
    e.preventDefault();
    setSearchTerm(keyword);
  }

  return (
    <div className="buscar-obra-container">
      <form className="buscar-obra-form" onSubmit={onSubmit}>
        <input
          className="buscar-obra-input"
          placeholder="Digite palavra-chave da obra..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="buscar-obra"
        />
        <button type="submit" className="buscar-obra-btn">Buscar</button>
      </form>

      <div className="buscar-obra-results">
        {isLoading && <div className="buscar-loading">Carregando resultados...</div>}
        {isError && <div className="buscar-error">Erro ao buscar obras</div>}

        {data && data.length === 0 && searchTerm && (
          <div className="buscar-empty">Nenhuma obra encontrada para "{searchTerm}"</div>
        )}

        {data && data.length > 0 && (
          <table className="buscar-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Sinopse</th>
                <th>Data Lanç.</th>
                <th>Temporadas</th>
                <th>Duração</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {data.map((obra) => (
                <tr key={obra.codigo}>
                  <td>{obra.codigo}</td>
                  <td>{obra.nome}</td>
                  <td className="sinopse-cell">{obra.sinopse}</td>
                  <td>{obra.dataLancamento ? new Date(obra.dataLancamento).toLocaleDateString() : "-"}</td>
                  <td>{obra.qntTemporadas ?? "-"}</td>
                  <td>{obra.duracao ?? "-"}</td>
                  <td>{obra.tipoTexto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
