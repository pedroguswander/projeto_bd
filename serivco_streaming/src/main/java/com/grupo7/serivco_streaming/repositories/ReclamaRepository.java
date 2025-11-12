package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.Reclama;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ReclamaRepository {

    private final JdbcTemplate jdbc;

    public ReclamaRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Reclama insert(Reclama reclama) {
        String sql = "INSERT INTO reclama (fk_usuario_id, fk_reclamacao_pk) VALUES (?, ?)";
        jdbc.update(sql, reclama.fkUsuarioId, reclama.fkReclamacaoPk);
        return reclama;
    }
}