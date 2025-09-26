
package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    Usuario create(Usuario usuario);
    List<Usuario> findAll();
    Optional<Usuario> findById(int id);
    Usuario update(int id, Usuario usuario);
    void delete(int id);
}