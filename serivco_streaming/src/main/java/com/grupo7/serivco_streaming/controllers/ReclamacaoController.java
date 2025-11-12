package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.Reclama;
import com.grupo7.serivco_streaming.services.ReclamacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reclamacoes")
public class ReclamacaoController {

    private final ReclamacaoService reclamacaoService;

    public ReclamacaoController(ReclamacaoService reclamacaoService) {
        this.reclamacaoService = reclamacaoService;
    }

    @PostMapping
    public ResponseEntity<Reclama> create(@RequestBody Reclama body) {
        // O serviço agora salva a reclamação E o log
        Reclama reclamaCriada = reclamacaoService.create(body);
        return ResponseEntity.created(null).body(reclamaCriada);
    }
}