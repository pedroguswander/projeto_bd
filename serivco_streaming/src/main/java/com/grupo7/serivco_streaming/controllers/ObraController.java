package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.Obra;
import com.grupo7.serivco_streaming.services.ObraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/obras")
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

    @GetMapping("/buscarNome/{name}")
    public ResponseEntity<Obra> getObraByName(@PathVariable String name) {
        return obraService.findByName(name)
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
    public List<String> getObrasPorGenero(@RequestParam String nome) {
        return obraService.findByGenero(nome);
    }

    @GetMapping("/buscar")
    public List<Obra> getObraWithLike(@RequestParam String nome) {
        return obraService.findByNomeContaining(nome);
    }

    @GetMapping("/por-data-lancamento")
    public List<Obra> getObraWhereDateIs(@RequestParam LocalDate data) {
        return obraService.findByDataLancamento(data);
    }

    @GetMapping("/usuarios-sem-plano")
    public List<String> getUsuariosSemPlano() {
        return obraService.getUsuariosSemPlano();
    }

    @GetMapping("/{codigoObra}/metricas")
    public ResponseEntity<Map<String, Object>> getMetricasVisualizacao(@PathVariable int codigoObra) {

        // O resultado é um Map, que é serializado para JSON
        Map<String, Object> metricas = obraService.obterMetricasVisualizacao(codigoObra);

        // Retorna o Map com status HTTP 200 OK
        return ResponseEntity.ok(metricas);
    }

    @GetMapping("/medias-das-notas")
    public ResponseEntity<List<Map<String, Object>>> getMediaNotasObras(
            @RequestParam(required = false) Integer obraCodigo) {

        // O repositório agora retorna List<Map<String, Object>>
        List<Map<String, Object>> medias = obraService.calcularMedias(obraCodigo);

        if (medias.isEmpty()) {
            // Retorna 404 Not Found se um código específico foi passado e não encontrou a obra.
            if (obraCodigo != null) {
                return ResponseEntity.notFound().build();
            }
        }

        // Retorna 200 OK com a lista de mapas.
        return ResponseEntity.ok(medias);
    }

    @GetMapping("/distribuicao/genero")
    public ResponseEntity<List<Map<String, Object>>> getDistribuicaoPorGenero() {
        List<Map<String, Object>> distribuicao = obraService.findDistribuicaoPorGenero();

        if (distribuicao.isEmpty()) {
            // Retorna 204 No Content se não houver dados, ou um 200 OK com lista vazia.
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(distribuicao);
    }
}