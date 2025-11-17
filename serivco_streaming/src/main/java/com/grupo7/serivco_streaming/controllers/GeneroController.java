package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.Genero;
import com.grupo7.serivco_streaming.services.GeneroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/generos")
public class GeneroController {

    @Autowired
    private GeneroService generoService;

    @PostMapping
    public ResponseEntity<Genero> criarGenero(@RequestBody Genero genero) {
        Genero novoGenero = generoService.criarGenero(genero);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(novoGenero.getGenero_PK())
                .toUri();
        return ResponseEntity.created(location).body(novoGenero);
    }

    @GetMapping
    public ResponseEntity<List<Genero>> listarGeneros() {
        List<Genero> generos = generoService.listarTodosGeneros();
        return ResponseEntity.ok(generos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Genero> buscarGeneroPorId(@PathVariable int id) {
        return generoService.buscarGeneroPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Genero> atualizarGenero(@PathVariable int id, @RequestBody Genero genero) {
        boolean atualizado = generoService.atualizarGenero(id, genero);
        if (atualizado) {
            genero.setGenero_PK(id);
            return ResponseEntity.ok(genero);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarGenero(@PathVariable int id) {
        boolean deletado = generoService.deletarGenero(id);
        if (deletado) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}