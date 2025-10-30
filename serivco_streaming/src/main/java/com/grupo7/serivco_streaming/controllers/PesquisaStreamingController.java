package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.PesquisaStreaming;
import com.grupo7.serivco_streaming.services.PesquisaStreamingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pesquisas") 
public class PesquisaStreamingController {

    private final PesquisaStreamingService pesquisaService;

    public PesquisaStreamingController(PesquisaStreamingService pesquisaService) {
        this.pesquisaService = pesquisaService;
    }

    @PostMapping
    public ResponseEntity<PesquisaStreaming> create(@RequestBody PesquisaStreaming body) {
        PesquisaStreaming pesquisaCriada = pesquisaService.create(body);
        URI location = URI.create("/api/pesquisas/" + pesquisaCriada.idResposta);
        return ResponseEntity.created(location).body(pesquisaCriada);
    }

    @GetMapping
    public List<PesquisaStreaming> list() {
        return pesquisaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PesquisaStreaming> getById(@PathVariable int id) {
        return pesquisaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PesquisaStreaming> update(@PathVariable int id, @RequestBody PesquisaStreaming body) {
        PesquisaStreaming pesquisaAtualizada = pesquisaService.update(id, body);
        return ResponseEntity.ok(pesquisaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        pesquisaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/satisfacao-por-genero")
    public Map<String, Double> getMediaSatisfacaoPorGenero()
    {
        return pesquisaService.getMediaSatisfacaoPorGenero();
    }

    @GetMapping("/horas-semanais")
    public Map<String, Long> getHorasSemanais() { return pesquisaService.getStreamingHoursCountsByValue(); }
}