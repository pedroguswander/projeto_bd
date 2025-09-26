// Local: com/grupo7/serivco_streaming/controllers/PesquisaStreamingController.java
package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.PesquisaStreaming;
import com.grupo7.serivco_streaming.repositories.PesquisaStreamingRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/pesquisas") // URL base para acessar os dados desta pesquisa
public class PesquisaStreamingController {

    private final PesquisaStreamingRepository repo;

    public PesquisaStreamingController(PesquisaStreamingRepository repo) {
        this.repo = repo;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<?> create(@RequestBody PesquisaStreaming body) {
        try {
            // Adicionada uma verificação de e-mail duplicado, como no seu Controller original
            if (body.email != null && repo.existsByEmail(body.email)) {
                return ResponseEntity.status(409).body("Este email já respondeu a pesquisa.");
            }
            int id = repo.insert(body);
            body.idResposta = id;
            return ResponseEntity.created(URI.create("/pesquisas/" + id)).body(body);
        } catch (DuplicateKeyException e) {
            return ResponseEntity.status(409).body("Violação de unicidade (email).");
        }
    }

    // READ ALL
    @GetMapping
    public List<PesquisaStreaming> list() {
        return repo.findAll();
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<PesquisaStreaming> getById(@PathVariable int id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody PesquisaStreaming body) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.update(id, body);
        return repo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.delete(id);
        return ResponseEntity.noContent().build();
    }
}