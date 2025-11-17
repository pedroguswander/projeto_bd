package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.Genero;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class GeneroRepository {

    @Autowired
    private JdbcTemplate jdbc;

    private static final String SQL_INSERT = "INSERT INTO genero (nome) VALUES (?)";
    private static final String SQL_UPDATE = "UPDATE genero SET nome = ? WHERE genero_PK = ?";
    private static final String SQL_FIND_BY_ID = "SELECT * FROM genero WHERE genero_PK = ?";
    private static final String SQL_FIND_ALL = "SELECT * FROM genero";
    private static final String SQL_DELETE_BY_ID = "DELETE FROM genero WHERE genero_PK = ?";

    public Genero create(Genero genero) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(SQL_INSERT, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, genero.getNome());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            genero.setGenero_PK(keyHolder.getKey().intValue());
        }
        return genero;
    }

    public Optional<Genero> findById(int id) {
        try {
            Genero genero = jdbc.queryForObject(SQL_FIND_BY_ID,
                    new BeanPropertyRowMapper<>(Genero.class),
                    id);
            return Optional.ofNullable(genero);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Genero> findAll() {
        return jdbc.query(SQL_FIND_ALL, new BeanPropertyRowMapper<>(Genero.class));
    }

    public int update(int id, Genero genero) {
        return jdbc.update(SQL_UPDATE,
                genero.getNome(),
                id);
    }

    public int deleteById(int id) {
        return jdbc.update(SQL_DELETE_BY_ID, id);
    }
}