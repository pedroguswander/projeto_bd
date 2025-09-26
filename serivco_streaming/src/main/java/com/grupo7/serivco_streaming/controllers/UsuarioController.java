package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.Usuario;
import com.grupo7.serivco_streaming.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<Usuario> create(@RequestBody Usuario body) {
        Usuario usuarioCriado = usuarioService.create(body);
        URI location = URI.create("/api/usuarios/" + usuarioCriado.usuarioId);
        return ResponseEntity.created(location).body(usuarioCriado);
    }

    @GetMapping
    public List<Usuario> list() {
        return usuarioService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getById(@PathVariable int id) {
        return usuarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable int id, @RequestBody Usuario body) {
        Usuario usuarioAtualizado = usuarioService.update(id, body);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}