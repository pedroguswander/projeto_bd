package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.repositories.PesquisaRepository;
import com.grupo7.serivco_streaming.services.ObraService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pesquisa")
public class PesquisaController {

    private final PesquisaRepository pesquisaRepository;

    public PesquisaController(PesquisaRepository pesquisaRepository) {
        this.pesquisaRepository = pesquisaRepository;
    }

    @GetMapping
    public Map<String, Double> getMediaSatisfacaoPorGenero()
    {
        return pesquisaRepository.getMediaSatisfacaoPorGenero();
    }
}
