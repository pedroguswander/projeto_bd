package com.grupo7.serivco_streaming.dto;

public class PesquisaRawDTO {

    // Nomes devem corresponder ao camelCase das colunas do DB
    // (BeanPropertyRowMapper cuida de 'preco_ideal_menos' para 'precoIdealMenos')
    private String precoIdealMenos;
    private String qtdAssinaturas;

    // Construtor vazio (necessário para o RowMapper)
    public PesquisaRawDTO() {
    }

    // Getters e Setters
    public String getPrecoIdealMenos() {
        return precoIdealMenos;
    }

    public void setPrecoIdealMenos(String precoIdealMenos) {
        this.precoIdealMenos = precoIdealMenos;
    }

    public String getQtdAssinaturas() {
        return qtdAssinaturas;
    }

    public void setQtdAssinaturas(String qtdAssinaturas) {
        this.qtdAssinaturas = qtdAssinaturas;
    }
}
