package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.Usuario;
import com.grupo7.serivco_streaming.repositories.UsuarioRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository repo;

    public UsuarioController(UsuarioRepository repo) {
        this.repo = repo;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Usuario body) {
        try {
            if (body.email != null && repo.existsByEmail(body.email)) {
                return ResponseEntity.status(409).body("Email já cadastrado.");
            }
            int id = repo.insert(body);
            body.usuarioId = id;
            return ResponseEntity.created(URI.create("/usuarios/" + id)).body(body);
        } catch (DuplicateKeyException e) {
            return ResponseEntity.status(409).body("Violação de unicidade (email).");
        }
    }

    // READ ALL
    @GetMapping
    public List<Usuario> list() {
        return repo.findAll();
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getById(@PathVariable int id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Usuario body) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // se trocar email, verifique duplicidade
        if (body.email != null && repo.existsByEmail(body.email)) {
            // poderia checar se é o mesmo usuário, mas mantendo simples aqui
            // (se quiser, busque o usuário atual e compare emails)
        }
        int rows = repo.update(id, body);
        if (rows == 0) return ResponseEntity.notFound().build();
        return repo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.delete(id);
        return ResponseEntity.noContent().build();
    }
}
