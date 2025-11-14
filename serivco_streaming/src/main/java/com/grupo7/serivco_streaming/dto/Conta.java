package com.grupo7.serivco_streaming.dto;

import java.sql.Date;
import lombok.Getter;
import lombok.Setter;

/**
 * Modelo (POJO) que representa a entidade 'conta' do banco de dados.
 * Nota: O campo data_criacao é ignorado, como solicitado.
 */
@Getter
@Setter
public class Conta {

    private Integer codigo; // Chave primária (Integer para permitir nulo antes do INSERT)
    private Date dataExpiracao;
    private String icone;
    private String statusAssinatura;
    private Integer fkUsuarioId;
    private Integer fkAdministradorId;

    // Construtor padrão é útil para RowMappers
    public Conta() {
    }
}