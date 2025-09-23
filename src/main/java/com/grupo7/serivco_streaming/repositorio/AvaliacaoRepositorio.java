package com.grupo7.serivco_streaming.repositorio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class AvaliacaoRepositorio {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public AvaliacaoRepositorio(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getAvaliacaoComNota9()
    {
        String query = "SELECT texto FROM avaliacao WHERE nota = 9";
        return jdbcTemplate.queryForList(query);
    }

}
