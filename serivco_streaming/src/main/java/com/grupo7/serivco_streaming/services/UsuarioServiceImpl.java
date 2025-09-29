package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.Usuario;
import com.grupo7.serivco_streaming.exception.ResourceNotFoundException;
import com.grupo7.serivco_streaming.repositories.UsuarioRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Usuario create(Usuario usuario) {
        if (usuario.email != null && usuarioRepository.existsByEmail(usuario.email)) {
            throw new DuplicateKeyException("Email já cadastrado.");
        }
        int id = usuarioRepository.insert(usuario);
        usuario.usuarioId = id;
        return usuario;
    }

    @Override
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> findById(int id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public List<Usuario> findByBairro(String bairro) {
        return usuarioRepository.findByBairro(bairro);
    }

    @Override
    public Usuario update(int id, Usuario usuario) {
        usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com o id: " + id));

        usuario.usuarioId = id;
        usuarioRepository.update(id, usuario);
        return usuario;
    }

    @Override
    public void delete(int id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado com o id: " + id);
        }
        usuarioRepository.delete(id);
    }
}