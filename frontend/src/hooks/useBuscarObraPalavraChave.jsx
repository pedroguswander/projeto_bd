import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Hook para buscar obras por nome (palavra-chave)
// Usa endpoint: GET /api/obras/buscar?nome=...
export default function useBuscarObra(nome) {
  return useQuery({
    queryKey: ["buscarObra", nome],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8080/api/obras/buscar?nome=${encodeURIComponent(nome)}`);
      const data = Array.isArray(res.data) ? res.data : [];

      // Mapeia resultado e normaliza campos: ignora fkGeneroGeneroPK
      return data.map((d) => ({
        codigo: d.codigo,
        nome: d.nome,
        sinopse: d.sinopse,
        dataLancamento: d.dataLancamento,
        qntTemporadas: d.qntTemporadas,
        duracao: d.duracao,
        obraTIPO: d.obraTIPO,
        tipoTexto: d.obraTIPO === 2 ? "série" : "filme",
      }));
    },
    enabled: !!nome && nome.trim().length > 0,
  });
}