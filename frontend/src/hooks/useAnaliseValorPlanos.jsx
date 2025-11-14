import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Hook que busca a análise de valor dos planos do backend
// Endpoint esperado: GET /api/planos/analise-valor
// Retorna um array de objetos: [{ categoria: string, valor: number }, ...]
export default function useAnaliseValorPlanos() {
  return useQuery({
    queryKey: ["analiseValorPlanos"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/api/planos/analise-valor");
      const data = Array.isArray(res.data) ? res.data : [];
      // normaliza: mapeia campos retornados pela API para { categoria, valor }
      return data.map((d) => {
        const categoria = d.plano ?? d.categoria ?? d.label ?? "Sem categoria";

        // Preferência de campos para o valor (fallbacks): preco_relativo, valor, media_horas_por_usuario,
        // satisfacao_geral_pesquisa, indice_reclamacao_por_usuario, telas_simultaneas
        const candidates = [
          d.preco_relativo,
          d.valor,
          d.media_horas_por_usuario,
          d.satisfacao_geral_pesquisa,
          d.indice_reclamacao_por_usuario,
          d.telas_simultaneas,
        ];

        let valor = 0;
        for (const v of candidates) {
          if (v !== undefined && v !== null && v !== "") {
            const num = typeof v === "number" ? v : Number(v);
            if (!Number.isNaN(num)) {
              valor = num;
              break;
            }
          }
        }

        return { categoria, valor };
      });
    },
  });
}
