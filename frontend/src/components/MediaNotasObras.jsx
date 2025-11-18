import React, { useState } from "react";
import { MediaNotasObrasChart } from "./MediaNotasObrasChart";
import { Search, XCircle } from "lucide-react";

// O CSS foi incluído aqui para demonstração. Em um projeto real, use um arquivo .css separado.
const styles = {
  container: {
    padding: "50px",
    backgroundColor: "#ffffff", // Cor de fundo suave (gray-50)
    borderRadius: "16px", // Arredondamento sutil (rounded-2xl)
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra média (shadow-md)
    maxWidth: "640px",
    margin: "24px auto", // Centraliza e dá margem superior/inferior
    border: "1px solid #e5e7eb", // Borda leve para definição
  },
  title: {
    fontSize: "1.5rem", // H2
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    gap: "8px",
  },
  input: {
    border: "1px solid #d1d5db",
    borderRadius: "8px", // Arredondamento
    padding: "10px 16px",
    width: "256px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputFocus: {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)", // Anel de foco azul
    outline: "none",
  },
  buttonPrimary: {
    backgroundColor: "#2563eb", // Cor principal (blue-600)
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.2s",
  },
  buttonPrimaryHover: {
    backgroundColor: "#1d4ed8", // blue-700
  },
  buttonClear: {
    marginLeft: "8px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#ef4444", // red-500
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
    transition: "color 0.2s",
  },
  buttonClearHover: {
    color: "#b91c1c", // red-700
  },
};

export const MediaNotasObras = () => {
  const [obraCodigo, setObraCodigo] = useState("");
  const [filtro, setFiltro] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isClearHovered, setIsClearHovered] = useState(false);

  const handleBuscar = (e) => {
    e.preventDefault();
    const value = obraCodigo.trim();
    // Usa parseInt para garantir que o filtro seja um número ou null
    setFiltro(value === "" ? null : parseInt(value, 10));
  };

  const limparFiltro = () => {
    setObraCodigo("");
    setFiltro(null);
  };

  const isSearching = !!filtro;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Médias das Notas por Obra</h2>

      <form onSubmit={handleBuscar} style={styles.form}>
        <input
          type="number"
          placeholder="Digite o ID da obra..."
          value={obraCodigo}
          onChange={(e) => setObraCodigo(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          style={{ ...styles.input, ...(isInputFocused ? styles.inputFocus : {}) }}
        />
        <button
          type="submit"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          style={{ ...styles.buttonPrimary, ...(isButtonHovered ? styles.buttonPrimaryHover : {}) }}
        >
          <Search size={18} /> Buscar
        </button>

        {filtro !== null && (
          <button
            type="button"
            onClick={limparFiltro}
            onMouseEnter={() => setIsClearHovered(true)}
            onMouseLeave={() => setIsClearHovered(false)}
            style={{ ...styles.buttonClear, ...(isClearHovered ? styles.buttonClearHover : {}) }}
          >
            <XCircle size={18} /> Limpar
          </button>
        )}
      </div>

      {/* Renderiza o Gráfico */}
      <MediaNotasObrasChart obraCodigo={filtro} />
    </div>
  );
};