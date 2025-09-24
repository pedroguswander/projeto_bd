package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.Obra;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ObraRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Método para inserir uma nova obra (POST)
    public int insert(Obra obra) {
        String sql = "INSERT INTO obra (fk_genero_genero_PK, nome, sinopse, data_lancamento, qnt_temporadas, duracao, obra_TIPO) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                obra.fkGeneroGeneroPK,
                obra.nome,
                obra.sinopse,
                obra.dataLancamento,
                obra.qntTemporadas,
                obra.duracao,
                obra.obraTIPO);
    }

    // Método para atualizar uma obra existente (PUT)
    public int update(Obra obra) {
        String sql = "UPDATE obra SET fk_genero_genero_PK = ?, nome = ?, sinopse = ?, data_lancamento = ?, qnt_temporadas = ?, duracao = ?, obra_TIPO = ? " +
                "WHERE codigo = ?";
        return jdbcTemplate.update(sql,
                obra.fkGeneroGeneroPK,
                obra.nome,
                obra.sinopse,
                obra.dataLancamento,
                obra.qntTemporadas,
                obra.duracao,
                obra.obraTIPO,
                obra.codigo);
    }

    // Método para deletar uma obra pelo código (DELETE)
    public int deleteById(int codigo) {
        String sql = "DELETE FROM obra WHERE codigo = ?";
        return jdbcTemplate.update(sql, codigo);
    }
}
