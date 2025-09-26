package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.Obra;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@Repository
public class ObraRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Método para inserir uma nova obra (POST)
    public int insert(Obra obra) {
        String sql = "INSERT INTO obra (fk_genero_genero_PK, nome, sinopse, data_lancamento, qnt_temporadas, duracao, obra_TIPO) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                obra.fk_genero_genero_PK,
                obra.nome,
                obra.sinopse,
                obra.data_lancamento,
                obra.qnt_temporadas,
                obra.duracao,
                obra.obra_TIPO);
    }

    // Método para atualizar uma obra existente (PUT)
    public int update(Obra obra) {
        String sql = "UPDATE obra SET fk_genero_genero_PK = ?, nome = ?, sinopse = ?, data_lancamento = ?, qnt_temporadas = ?, duracao = ?, obra_TIPO = ? " +
                "WHERE codigo = ?";
        return jdbcTemplate.update(sql,
                obra.fk_genero_genero_PK,
                obra.nome,
                obra.sinopse,
                obra.data_lancamento,
                obra.qnt_temporadas,
                obra.duracao,
                obra.obra_TIPO,
                obra.codigo);
    }

    // Método para deletar uma obra pelo código (DELETE)
    public int deleteById(int codigo) {
        String sql = "DELETE FROM obra WHERE codigo = ?";
        return jdbcTemplate.update(sql, codigo);
    }

    public List<Map<String, Object>> getObrasPorGenero()
    {
        String sql = "SELECT o.nome, g.nome from obra o join genero g on o.fk_genero_genero_PK=g.genero_PK";
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getObraWithLike(String busca)
    {
        String sql = "select nome from obra where nome like ?";
        return jdbcTemplate.queryForList(sql, busca);
    }

    public List<Map<String, Object>> getObraWhereDateIs(String busca)
    {
        String sql = "select nome, data_lancamento from obra where data_lancamento=?";
        return jdbcTemplate.queryForList(sql, busca);
    }
}
