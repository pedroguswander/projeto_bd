import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useInserirUsuario = () => {
  return useMutation({
    mutationFn: async (usuario) => {
      const { data } = await axios.post("http://localhost:8080/api/usuarios", usuario, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    },
  });
};
