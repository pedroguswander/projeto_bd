package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.NivelPlano;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface PlanoService {
    NivelPlano classificarPorPreco(BigDecimal preco);
    NivelPlano getClassificacaoPlano(String tipoPlano);
    public List<Map<String, Object>> getNormalizedPlanoValues();
}