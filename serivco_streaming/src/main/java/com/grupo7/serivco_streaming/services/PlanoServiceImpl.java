package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.NivelPlano;
import com.grupo7.serivco_streaming.dto.Plano;
import com.grupo7.serivco_streaming.exception.ResourceNotFoundException;
import com.grupo7.serivco_streaming.repositories.PlanoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PlanoServiceImpl implements PlanoService {

    private final PlanoRepository planoRepository;

    // Constantes para os limites de preço
    private static final BigDecimal LIMITE_PREMIUM = new BigDecimal("50.00");
    private static final BigDecimal LIMITE_PADRAO = new BigDecimal("35.00");

    public PlanoServiceImpl(PlanoRepository planoRepository) {
        this.planoRepository = planoRepository;
    }

    /**
     * Equivalente Java da função CLASSIFICAR_PLANO_POR_PRECO
     */
    @Override
    public NivelPlano classificarPorPreco(BigDecimal preco) {
        if (preco == null) {
            return NivelPlano.BASICO_BAIXO;
        }

        if (preco.compareTo(LIMITE_PREMIUM) >= 0) {
            return NivelPlano.PREMIUM_ALTO;
        } else if (preco.compareTo(LIMITE_PADRAO) >= 0) {
            return NivelPlano.PADRAO_MEDIO;
        } else {
            return NivelPlano.BASICO_BAIXO;
        }
    }

    /**
     * Busca um plano e retorna sua classificação
     */
    @Override
    public NivelPlano getClassificacaoPlano(String tipoPlano) {
        Plano plano = planoRepository.findByTipo(tipoPlano)
                .orElseThrow(() -> new ResourceNotFoundException("Plano não encontrado: " + tipoPlano));

        return classificarPorPreco(plano.preco);
    }
}