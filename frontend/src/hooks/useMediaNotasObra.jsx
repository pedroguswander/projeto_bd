// src/hooks/useMediaNotasObras.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMediaNotasObras = (obraCodigo) => {
  return useQuery({
    queryKey: ["mediaNotasObras", obraCodigo],
    queryFn: async () => {
      const params = obraCodigo ? { obraCodigo } : {};
      const { data } = await axios.get("http://localhost:8080/api/obras/medias-das-notas", { params });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
