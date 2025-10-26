package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.Usuario;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepository {

    private final JdbcTemplate jdbc;

    public UsuarioRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Usuario> mapper = (rs, rowNum) -> {
        Usuario u = new Usuario();
        u.usuarioId = rs.getInt("usuario_id");
        u.rua = rs.getString("rua");
        u.bairro = rs.getString("bairro");

        Integer numero = (Integer) rs.getObject("numero");
        u.numero = numero;

        u.nome = rs.getString("nome");
        u.email = rs.getString("email");
        u.senha = rs.getString("senha");
        return u;
    };

    // CREATE
    public int insert(Usuario u) {
        String sql = """
            INSERT INTO usuario
            (rua, bairro, numero, nome, email, senha)
            VALUES (?, ?, ?, ?, ?, ?)
        """;
        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, u.rua);
            ps.setString(2, u.bairro);
            if (u.numero == null) ps.setNull(3, java.sql.Types.INTEGER);
            else ps.setInt(3, u.numero);
            ps.setString(4, u.nome);
            ps.setString(5, u.email);
            ps.setString(6, u.senha);
            return ps;
        }, kh);
        Number key = kh.getKey();
        return key == null ? 0 : key.intValue();
    }

    // READ
    public List<Usuario> findAll() {
        return jdbc.query("SELECT * FROM usuario", mapper);
    }

    public Optional<Usuario> findById(int id) {
        try {
            Usuario u = jdbc.queryForObject("SELECT * FROM usuario WHERE usuario_id = ?", mapper, id);
            return Optional.ofNullable(u);
        } catch (DataAccessException e) {
            return Optional.empty();
        }
    }

    public boolean existsById(int id) {
        Integer c = jdbc.queryForObject("SELECT COUNT(*) FROM usuario WHERE usuario_id = ?", Integer.class, id);
        return c != null && c > 0;
    }

    public boolean existsByEmail(String email) {
        Integer c = jdbc.queryForObject("SELECT COUNT(*) FROM usuario WHERE email = ?", Integer.class, email);
        return c != null && c > 0;
    }

    public Optional<Usuario> findByEmail(String email) {
        try {

            Usuario u = jdbc.queryForObject("SELECT * FROM usuario WHERE email = ?", mapper, email);
            return Optional.ofNullable(u);
        } catch (DataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Usuario> findByBairro(String bairro) {
        String sql = "SELECT * FROM usuario WHERE bairro = ?";
        return jdbc.query(sql, mapper, bairro);
    }

    public int update(int id, Usuario u) {
        String sql = """
            UPDATE usuario
               SET rua = ?,
                   bairro = ?,
                   numero = ?,
                   nome = ?,
                   email = ?,
                   senha = ?
             WHERE usuario_id = ?
        """;
        return jdbc.update(sql,
                u.rua,
                u.bairro,
                u.numero,
                u.nome,
                u.email,
                u.senha,
                id
        );
    }

    public int delete(int id) {
        return jdbc.update("DELETE FROM usuario WHERE usuario_id = ?", id);
    }
}
