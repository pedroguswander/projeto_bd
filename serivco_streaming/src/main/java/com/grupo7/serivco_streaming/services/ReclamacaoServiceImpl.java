package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.LogReclamacoes;
import com.grupo7.serivco_streaming.dto.Reclama;
import com.grupo7.serivco_streaming.repositories.LogReclamacoesRepository;
import com.grupo7.serivco_streaming.repositories.ReclamaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ReclamacaoServiceImpl implements ReclamacaoService {

    private final ReclamaRepository reclamaRepository;
    private final LogReclamacoesRepository logRepository;

    public ReclamacaoServiceImpl(ReclamaRepository reclamaRepository, LogReclamacoesRepository logRepository) {
        this.reclamaRepository = reclamaRepository;
        this.logRepository = logRepository;
    }

    // --- INÍCIO DA LÓGICA DO TRIGGER "log_nova_reclamacao" ---
    @Override
    @Transactional // Garante que ou ambos salvam, ou nenhum salva
    public Reclama create(Reclama reclama) {
        // 1. Salva a reclamação principal
        Reclama reclamaSalva = reclamaRepository.insert(reclama);

        // 2. Cria e salva o log (lógica do AFTER INSERT)
        LogReclamacoes log = new LogReclamacoes();
        log.usuarioId = reclamaSalva.fkUsuarioId;
        log.reclamacaoId = reclamaSalva.fkReclamacaoPk;
        log.acao = "INSERT";
        log.dataHora = LocalDateTime.now();

        logRepository.insert(log);

        return reclamaSalva;
    }
    // --- FIM DA LÓGICA DO TRIGGER ---
}