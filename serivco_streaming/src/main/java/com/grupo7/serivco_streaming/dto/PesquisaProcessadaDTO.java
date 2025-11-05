package com.grupo7.serivco_streaming.dto;

public class PesquisaProcessadaDTO {

    private int precoIdeal;
    private int qtdAssinaturas;

    // Construtor
    public PesquisaProcessadaDTO(int precoIdeal, int qtdAssinaturas) {
        this.precoIdeal = precoIdeal;
        this.qtdAssinaturas = qtdAssinaturas;
    }

    // Getters e Setters
    public int getPrecoIdeal() {
        return precoIdeal;
    }

    public void setPrecoIdeal(int precoIdeal) {
        this.precoIdeal = precoIdeal;
    }

    public int getQtdAssinaturas() {
        return qtdAssinaturas;
    }

    public void setQtdAssinaturas(int qtdAssinaturas) {
        this.qtdAssinaturas = qtdAssinaturas;
    }
}
