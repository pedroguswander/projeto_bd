package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.LogReclamacoes;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

@Repository
public class LogReclamacoesRepository {

    private final JdbcTemplate jdbc;

    public LogReclamacoesRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void insert(LogReclamacoes log) {
        String sql = "INSERT INTO log_reclamacoes (usuario_id, reclamacao_id, data_hora, acao) VALUES (?, ?, ?, ?)";
        jdbc.update(sql, log.usuarioId, log.reclamacaoId, Timestamp.valueOf(log.dataHora), log.acao);
    }
}