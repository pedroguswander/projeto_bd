package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.NivelPlano;
import com.grupo7.serivco_streaming.dto.Plano;
import com.grupo7.serivco_streaming.exception.ResourceNotFoundException;
import com.grupo7.serivco_streaming.repositories.PlanoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    private static final Map<String, Boolean> NORMALIZATION_BEHAVIOR = Map.of(
            "preco_relativo", Boolean.FALSE, // FALSE = Inverso (quanto menor o preço, maior o valor)
            "telas_simultaneas", Boolean.TRUE, // TRUE = Direto
            "media_horas_por_usuario", Boolean.TRUE, // TRUE = Direto
            "indice_reclamacao_por_usuario", Boolean.FALSE, // FALSE = Inverso (quanto menor a reclamação, maior o valor)
            "satisfacao_geral_pesquisa", Boolean.TRUE // TRUE = Direto
    );

    /**
     * Busca um plano e retorna sua classificação
     */
    @Override
    public NivelPlano getClassificacaoPlano(String tipoPlano) {
        Plano plano = planoRepository.findByTipo(tipoPlano)
                .orElseThrow(() -> new ResourceNotFoundException("Plano não encontrado: " + tipoPlano));

        return classificarPorPreco(plano.preco);
    }


    @Override
    public List<Map<String, Object>> getNormalizedPlanoValues() {
        List<Map<String, Object>> rawData = planoRepository.buscarAnaliseValor();

        if (rawData.isEmpty()) {
            return rawData;
        }

        // 1. Encontrar o Min e o Max para cada métrica
        Map<String, Double> minValues = new HashMap<>();
        Map<String, Double> maxValues = new HashMap<>();

        // Inicializa min/max com os valores do primeiro elemento
        // e define as chaves que serão normalizadas
        for (String key : NORMALIZATION_BEHAVIOR.keySet()) {
            // Acessa o valor e converte para double (garantindo que seja um tipo numérico)
            double initialValue = ((Number) rawData.get(0).get(key)).doubleValue();
            minValues.put(key, initialValue);
            maxValues.put(key, initialValue);
        }

        // Itera sobre o restante dos dados para encontrar os extremos
        for (Map<String, Object> row : rawData) {
            for (String key : NORMALIZATION_BEHAVIOR.keySet()) {
                double currentValue = ((Number) row.get(key)).doubleValue();

                if (currentValue < minValues.get(key)) {
                    minValues.put(key, currentValue);
                }
                if (currentValue > maxValues.get(key)) {
                    maxValues.put(key, currentValue);
                }
            }
        }

        // 2. Aplicar a Normalização (Min-Max Scaling)
        return rawData.stream().map(rawMap -> {
            Map<String, Object> normalizedMap = new HashMap<>();

            // Copia a chave principal (nome do plano)
            normalizedMap.put("plano", rawMap.get("plano"));

            for (String key : NORMALIZATION_BEHAVIOR.keySet()) {
                double value = ((Number) rawMap.get(key)).doubleValue();
                double min = minValues.get(key);
                double max = maxValues.get(key);
                double normalizedValue;

                // Evita divisão por zero se todos os valores forem idênticos (Max == Min)
                if (max == min) {
                    normalizedValue = 100.0; // Se todos são iguais, pontua 100%
                } else {
                    double range = max - min;

                    // Normalização Direta: X_norm = (X - Min) / Range
                    if (NORMALIZATION_BEHAVIOR.get(key)) {
                        normalizedValue = (value - min) / range * 100;
                    }
                    // Normalização Inversa: X_norm = (Max - X) / Range
                    else {
                        normalizedValue = (max - value) / range * 100;
                    }
                }

                // Formata o valor para ter 2 casas decimais e armazena na chave 'key_normalizado'
                normalizedMap.put(key, Math.round(normalizedValue * 100.0) / 100.0);
            }
            return normalizedMap;
        }).collect(Collectors.toList());
    }
}