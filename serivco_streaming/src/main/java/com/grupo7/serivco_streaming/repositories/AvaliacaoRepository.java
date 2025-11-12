package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.Avaliacao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;

@Repository
public class AvaliacaoRepository {

    private final JdbcTemplate jdbc;

    public AvaliacaoRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public boolean existsByContaAndObra(int contaCod, int obraCodigo) {
        String sql = "SELECT COUNT(*) FROM avaliacao WHERE fk_conta_cod = ? AND fk_obra_codigo = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, contaCod, obraCodigo);
        return count != null && count > 0;
    }

    public Avaliacao insert(Avaliacao avaliacao) {
        String sql = "INSERT INTO avaliacao (fk_conta_cod, fk_obra_codigo, nota, data_avaliacao, texto) VALUES (?, ?, ?, ?, ?)";

        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, avaliacao.fkContaCod);
            ps.setInt(2, avaliacao.fkObraCodigo);
            ps.setObject(3, avaliacao.nota); // Permite null se nota não for obrigatória
            ps.setObject(4, avaliacao.dataAvaliacao);
            ps.setString(5, avaliacao.texto);
            return ps;
        });
        return avaliacao;
    }
}