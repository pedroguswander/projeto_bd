import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useDeletarUsuario = () => {
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:8080/api/usuarios/${id}`);
    },
  });
};
