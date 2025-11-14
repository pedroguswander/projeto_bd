package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.Plano;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class PlanoRepository {

    private final JdbcTemplate jdbc;

    public PlanoRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Plano> mapper = (rs, rowNum) -> {
        Plano p = new Plano();
        p.tipoDoPlano = rs.getString("tipo_do_plano");
        p.preco = rs.getBigDecimal("preco");
        p.qntDeTelasSimultaneas = rs.getInt("qnt_de_telas_simultaneas");
        p.possuiAnuncio = rs.getBoolean("possui_anuncio");
        return p;
    };

    public List<Map<String, Object>> buscarAnaliseValor() {
        // A query seleciona todas as colunas da sua VIEW
        String sql = "SELECT * FROM analise_valor_plano";

        // Retorna a lista de mapas, conforme o requisito
        return jdbc.queryForList(sql);
    }

    public Optional<Plano> findByTipo(String tipoPlano) {
        try {
            Plano p = jdbc.queryForObject("SELECT * FROM plano WHERE tipo_do_plano = ?", mapper, tipoPlano);
            return Optional.ofNullable(p);
        } catch (DataAccessException e) {
            return Optional.empty();
        }
    }
}