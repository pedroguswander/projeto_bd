package com.grupo7.serivco_streaming.dto;

public enum NivelPlano {
    PREMIUM_ALTO("Premium/Alto"),
    PADRAO_MEDIO("Padrão/Médio"),
    BASICO_BAIXO("Básico/Baixo");

    private final String descricao;

    NivelPlano(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}