package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.DetalheAvaliacaoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils; // Importante para checar a string

import java.util.List;

@Repository
public class DetalheAvaliacaoRepository { // Ou adicione ao seu ObraRepository

    @Autowired
    private JdbcTemplate jdbc;

    /**
     * Mapper que converte um ResultSet da view 'vw_detalhes_avaliacao'
     * para o nosso DTO.
     */
    private final RowMapper<DetalheAvaliacaoDTO> detalheMapper = (rs, rowNum) -> new DetalheAvaliacaoDTO(
            rs.getString("nome_usuario"),
            rs.getString("titulo_obra"),
            rs.getString("nome_genero"), // Exemplo
            rs.getDouble("nota"),            // Exemplo
            rs.getString("data_avaliacao"),
            rs.getString("comentario_avaliacao")// Exemplo
            // Mapeie as colunas restantes da sua view
    );

    /**
     * Busca detalhes da avaliação.
     * Se 'nomeUsuario' for fornecido, filtra por esse usuário.
     * Se 'nomeUsuario' for nulo ou vazio, retorna todos os detalhes.
     */
    public List<DetalheAvaliacaoDTO> getDetalheAvaliacaoObraUsuarios(String nome_usuario) {

        // StringUtils.hasText() checa se a string não é nula, nem vazia,
        // e nem contém apenas espaços em branco.
        if (nome_usuario != null && !nome_usuario.isEmpty()) {

            // LÓGICA CORRETA: Se um nome foi fornecido, usamos a consulta com WHERE.
            // Esta é a consulta que você especificou para "nome vazio",
            // mas ela deve ser usada quando o nome *não* está vazio.
            String sql = "SELECT * FROM vw_detalhes_avaliacao WHERE nome_usuario = ?;";

            // Passamos o mapper e os argumentos (nomeUsuario)
            return jdbc.query(sql, detalheMapper, nome_usuario);

        } else {

            // LÓGICA CORRETA: Se nenhum nome foi fornecido, retornamos todos.
            String sql = "SELECT * FROM vw_detalhes_avaliacao;";

            // Passamos apenas o mapper
            return jdbc.query(sql, detalheMapper);
        }
    }
}
