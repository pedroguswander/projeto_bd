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

        int fk = rs.getInt("fk_reclamacoes_reclamacoes_PK");
        u.fkReclamacoesReclamacoesPK = rs.wasNull() ? null : fk;

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
            (fk_reclamacoes_reclamacoes_PK, rua, bairro, numero, nome, email, senha)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """;
        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            if (u.fkReclamacoesReclamacoesPK == null) ps.setNull(1, java.sql.Types.INTEGER);
            else ps.setInt(1, u.fkReclamacoesReclamacoesPK);
            ps.setString(2, u.rua);
            ps.setString(3, u.bairro);
            if (u.numero == null) ps.setNull(4, java.sql.Types.INTEGER);
            else ps.setInt(4, u.numero);
            ps.setString(5, u.nome);
            ps.setString(6, u.email);
            ps.setString(7, u.senha);
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

    // UPDATE
    public int update(int id, Usuario u) {
        String sql = """
            UPDATE usuario
               SET fk_reclamacoes_reclamacoes_PK = ?,
                   rua = ?,
                   bairro = ?,
                   numero = ?,
                   nome = ?,
                   email = ?,
                   senha = ?
             WHERE usuario_id = ?
        """;
        return jdbc.update(sql,
                u.fkReclamacoesReclamacoesPK,
                u.rua,
                u.bairro,
                u.numero,
                u.nome,
                u.email,
                u.senha,
                id
        );
    }

    // DELETE
    public int delete(int id) {
        return jdbc.update("DELETE FROM usuario WHERE usuario_id = ?", id);
    }
}
