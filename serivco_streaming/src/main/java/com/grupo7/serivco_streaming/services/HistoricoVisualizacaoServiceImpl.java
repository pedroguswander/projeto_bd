package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.repositories.HistoricoVisualizacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HistoricoVisualizacaoServiceImpl implements HistoricoVisualizacaoService {

    private final HistoricoVisualizacaoRepository repository;

    public HistoricoVisualizacaoServiceImpl(HistoricoVisualizacaoRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public int ajustarProgresso() {
        return repository.ajustarProgressoConcluido();
    }
}