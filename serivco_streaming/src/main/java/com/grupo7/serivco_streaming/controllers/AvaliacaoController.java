package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.Avaliacao;
import com.grupo7.serivco_streaming.services.AvaliacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @PostMapping
    public ResponseEntity<Avaliacao> create(@RequestBody Avaliacao body) {
        Avaliacao avaliacaoCriada = avaliacaoService.create(body);
        // Cria uma URI fictícia, já que a PK é composta
        URI location = URI.create("/api/avaliacoes/" + avaliacaoCriada.fkContaCod + "/" + avaliacaoCriada.fkObraCodigo);
        return ResponseEntity.created(location).body(avaliacaoCriada);
    }
}