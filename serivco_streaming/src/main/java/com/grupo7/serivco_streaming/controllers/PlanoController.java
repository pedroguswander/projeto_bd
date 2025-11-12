package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.NivelPlano;
import com.grupo7.serivco_streaming.services.PlanoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/planos")
public class PlanoController {

    private final PlanoService planoService;

    public PlanoController(PlanoService planoService) {
        this.planoService = planoService;
    }

    @GetMapping("/{tipoPlano}/classificacao")
    public ResponseEntity<?> getClassificacao(@PathVariable String tipoPlano) {
        NivelPlano nivel = planoService.getClassificacaoPlano(tipoPlano);
        // Retorna um JSON simples com a descrição do nível
        return ResponseEntity.ok(Map.of("nivel", nivel.getDescricao()));
    }
}