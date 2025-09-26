package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.Obra;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class ObraRepository {

    private final JdbcTemplate jdbc;

    public ObraRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Obra> mapper = (rs, rowNum) -> {
        Obra o = new Obra();
        o.codigo = rs.getInt("codigo");
        o.fkGeneroGeneroPK = rs.getInt("fk_genero_genero_PK");
        o.nome = rs.getString("nome");
        o.sinopse = rs.getString("sinopse");
        o.dataLancamento = rs.getObject("data_lancamento", java.time.LocalDate.class);
        o.qntTemporadas = rs.getObject("qnt_temporadas", Integer.class);
        o.duracao = rs.getTime("duracao");
        o.obraTIPO = rs.getInt("obra_TIPO");
        return o;
    };

    public int insert(Obra obra) {
        String sql = "INSERT INTO obra (fk_genero_genero_PK, nome, sinopse, data_lancamento, qnt_temporadas, duracao, obra_TIPO) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, obra.fkGeneroGeneroPK);
            ps.setString(2, obra.nome);
            ps.setString(3, obra.sinopse);
            ps.setObject(4, obra.dataLancamento);
            ps.setObject(5, obra.qntTemporadas);
            ps.setTime(6, obra.duracao);
            ps.setInt(7, obra.obraTIPO);
            return ps;
        }, kh);
        Number key = kh.getKey();
        return key == null ? 0 : key.intValue();
    }

    public List<Obra> findAll() {
        return jdbc.query("SELECT * FROM obra", mapper);
    }

    public Optional<Obra> findById(int codigo) {
        try {
            Obra o = jdbc.queryForObject("SELECT * FROM obra WHERE codigo = ?", mapper, codigo);
            return Optional.ofNullable(o);
        } catch (DataAccessException e) {
            return Optional.empty();
        }
    }

    public boolean existsById(int codigo) {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM obra WHERE codigo = ?", Integer.class, codigo);
        return count != null && count > 0;
    }

    public int update(Obra obra) {
        String sql = "UPDATE obra SET fk_genero_genero_PK = ?, nome = ?, sinopse = ?, data_lancamento = ?, " +
                "qnt_temporadas = ?, duracao = ?, obra_TIPO = ? WHERE codigo = ?";
        return jdbc.update(sql, obra.fkGeneroGeneroPK, obra.nome, obra.sinopse, obra.dataLancamento,
                obra.qntTemporadas, obra.duracao, obra.obraTIPO, obra.codigo);
    }

    public int deleteById(int codigo) {
        String sql = "DELETE FROM obra WHERE codigo = ?";
        return jdbc.update(sql, codigo);
    }

    public List<Obra> findByGenero() {
        String sql = "SELECT * FROM obra o JOIN genero g ON o.fk_genero_genero_PK = g.genero_PK";
        return jdbc.query(sql, mapper);
    }

    public List<Obra> findByNomeContaining(String busca) {
        String sql = "SELECT * FROM obra WHERE nome LIKE ?";
        return jdbc.query(sql, mapper, busca + "%");
    }

    public List<Obra> findByDataLancamento(LocalDate data) {
        String sql = "SELECT * FROM obra WHERE data_lancamento = ?";
        return jdbc.query(sql, mapper, data);
    }
}