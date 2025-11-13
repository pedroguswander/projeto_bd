import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useBuscarUsuarioPorId = (id) => {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:8080/api/usuarios/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useAtualizarUsuario = () => {
  return useMutation({
    mutationFn: async ({ id, usuario }) => {
      const { data } = await axios.put(`http://localhost:8080/api/usuarios/${id}`, usuario, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    },
  });
};
