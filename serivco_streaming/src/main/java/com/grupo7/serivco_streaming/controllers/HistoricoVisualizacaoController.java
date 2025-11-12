package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.services.HistoricoVisualizacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/historico")
public class HistoricoVisualizacaoController {

    private final HistoricoVisualizacaoService service;

    public HistoricoVisualizacaoController(HistoricoVisualizacaoService service) {
        this.service = service;
    }

    @PostMapping("/ajustar-progresso")
    public ResponseEntity<?> ajustarProgressos() {
        int linhasAfetadas = service.ajustarProgresso();
        // Retorna uma resposta simples informando quantas linhas foram atualizadas
        return ResponseEntity.ok(Map.of("linhasAfetadas", linhasAfetadas));
    }
}