package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.Avaliacao;
import com.grupo7.serivco_streaming.repositories.AvaliacaoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AvaliacaoServiceImpl implements AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;

    public AvaliacaoServiceImpl(AvaliacaoRepository avaliacaoRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
    }

    @Override
    public Avaliacao create(Avaliacao avaliacao) {
        // --- INÍCIO DA LÓGICA DO TRIGGER "impedir_avaliacao_dupla" ---
        // Nota: O trigger SQL usa fk_usuario_id, mas a tabela usa fk_conta_cod. Estou usando fk_conta_cod.
        if (avaliacaoRepository.existsByContaAndObra(avaliacao.fkContaCod, avaliacao.fkObraCodigo)) {
            throw new IllegalArgumentException("Erro: Esta conta já avaliou esta obra. Não é permitida avaliação duplicada.");
        }
        // --- FIM DA LÓGICA DO TRIGGER ---

        // Define a data da avaliação se não for fornecida
        if (avaliacao.dataAvaliacao == null) {
            avaliacao.dataAvaliacao = LocalDate.now();
        }

        return avaliacaoRepository.insert(avaliacao);
    }
}