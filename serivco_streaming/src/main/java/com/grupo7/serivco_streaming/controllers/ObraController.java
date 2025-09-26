package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.Obra;
import com.grupo7.serivco_streaming.services.ObraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/obras")
public class ObraController {

    private final ObraService obraService;

    public ObraController(ObraService obraService) {
        this.obraService = obraService;
    }

    @PostMapping
    public ResponseEntity<Obra> createObra(@RequestBody Obra body) {
        Obra obraCriada = obraService.create(body);
        URI location = URI.create("/obras/" + obraCriada.codigo);
        return ResponseEntity.created(location).body(obraCriada);
    }

    @GetMapping
    public List<Obra> listObras() {
        return obraService.findAll();
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<Obra> getObraById(@PathVariable int codigo) {
        return obraService.findById(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<Obra> updateObra(@PathVariable int codigo, @RequestBody Obra body) {
        Obra obraAtualizada = obraService.update(codigo, body);
        return ResponseEntity.ok(obraAtualizada);
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> deleteObra(@PathVariable int codigo) {
        obraService.delete(codigo);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/por-genero")
    public List<Obra> getObrasPorGenero() {
        return obraService.findByGenero();
    }

    @GetMapping("/buscar")
    public List<Obra> getObraWithLike(@RequestParam String nome) {
        return obraService.findByNomeContaining(nome);
    }

    @GetMapping("/por-data-lancamento")
    public List<Obra> getObraWhereDateIs(@RequestParam LocalDate data) {
        return obraService.findByDataLancamento(data);
    }
}