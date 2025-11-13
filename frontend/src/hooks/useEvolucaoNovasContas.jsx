import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Hook que busca a contagem mensal de contas e filtra por ano
export default function useEvolucaoNovasContas(ano = 2024) {
  return useQuery({
    queryKey: ["evolucaoNovasContas", ano],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/api/contas/contagem-mensal");

      // Backend retorna uma lista de objetos com campos: quantidade, mes, ano
      const data = Array.isArray(res.data) ? res.data : [];

      // Filtra pelo ano solicitado e pelo ano anterior
      const filtrado = data.filter((d) => Number(d.ano) === Number(ano));
      const filtradoPrev = data.filter((d) => Number(d.ano) === Number(ano - 1));

      // Normaliza para meses 1..12 (se não houver mês, usa 0)
      const countsByMonth = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const found = filtrado.find((f) => Number(f.mes) === month);
        return {
          mes: month,
          quantidade: found ? Number(found.quantidade) : 0,
        };
      });

      const countsByMonthPrev = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const found = filtradoPrev.find((f) => Number(f.mes) === month);
        return {
          mes: month,
          quantidade: found ? Number(found.quantidade) : 0,
        };
      });

      const yearTotal = countsByMonth.reduce((s, c) => s + (c.quantidade || 0), 0);
      const previousYearTotal = countsByMonthPrev.reduce((s, c) => s + (c.quantidade || 0), 0);

      return {
        countsByMonth,
        countsByMonthPrev,
        yearTotal,
        previousYearTotal,
      };
    },
  });
}
