package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.NivelPlano;

import java.math.BigDecimal;

public interface PlanoService {
    NivelPlano classificarPorPreco(BigDecimal preco);
    NivelPlano getClassificacaoPlano(String tipoPlano);
}