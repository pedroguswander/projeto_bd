package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.Obra;
import com.grupo7.serivco_streaming.repositories.ObraRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/obras")
public class ObraController {

    private final ObraRepository obraRepository;

    public ObraController(ObraRepository obraRepository) {
        this.obraRepository = obraRepository;
    }

    @PostMapping
    public ResponseEntity<Obra> createObra(@RequestBody Obra body) {
        obraRepository.insert(body);
        return ResponseEntity.created(URI.create("/obras/")).body(body);
    }

    @GetMapping
    public List<Obra> listObras() {
        return obraRepository.findAll();
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<Obra> getObraById(@PathVariable int codigo) {
        return obraRepository.findById(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<Obra> updateObra(@PathVariable int codigo, @RequestBody Obra body) {
        if (!obraRepository.existsById(codigo)) {
            return ResponseEntity.notFound().build();
        }
        body.codigo = codigo;
        obraRepository.update(body);
        return ResponseEntity.ok(body);
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> deleteObra(@PathVariable int codigo) {
        if (!obraRepository.existsById(codigo)) {
            return ResponseEntity.notFound().build();
        }
        obraRepository.deleteById(codigo);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/por-genero")
    public List<Obra> getObrasPorGenero() {
        return obraRepository.findByGenero();
    }

    @GetMapping("/buscar")
    public List<Obra> getObraWithLike(@RequestParam String nome) {
        return obraRepository.findByNomeContaining(nome);
    }

    @GetMapping("/por-data-lancamento")
    public List<Obra> getObraWhereDateIs(@RequestParam LocalDate data) {
        return obraRepository.findByDataLancamento(data);
    }
}