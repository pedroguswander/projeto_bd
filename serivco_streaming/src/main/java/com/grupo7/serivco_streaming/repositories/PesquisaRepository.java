package com.grupo7.serivco_streaming.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;

@Repository
public class PesquisaRepository {

    private final JdbcTemplate jdbc;

    @Autowired
    public PesquisaRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Map<String, Double> getMediaSatisfacaoPorGenero() {

        // Consulta para a média de satisfação de "Masculino"
        String sqlMasculino = "SELECT AVG(satisfacao_geral) FROM pesquisa_streaming WHERE genero = 'Masculino'";

        // Consulta para a média de satisfação de "Feminino"
        String sqlFeminino = "SELECT AVG(satisfacao_geral) FROM pesquisa_streaming WHERE genero = 'Feminino'";

        // Mapa para armazenar os resultados
        Map<String, Double> medias = new HashMap<>();

        try {
            // Executa a primeira consulta e armazena o resultado.
            // Usamos queryForObject com Double.class para obter diretamente o valor da média (que é um número real).
            Double mediaMasculino = jdbc.queryForObject(sqlMasculino, Double.class);

            // Executa a segunda consulta e armazena o resultado.
            Double mediaFeminino = jdbc.queryForObject(sqlFeminino, Double.class);

            // Adiciona os resultados ao mapa.
            medias.put("media_masculino", mediaMasculino != null ? mediaMasculino : 0.0);
            medias.put("media_feminino", mediaFeminino != null ? mediaFeminino : 0.0);

        } catch (Exception e) {
            // Log ou tratamento de exceção adequado (ex: se a tabela não existe ou erro de SQL)
            System.err.println("Erro ao calcular a média de satisfação por gênero: " + e.getMessage());
            // Retorna um mapa vazio ou com valores default em caso de erro.
            return Map.of("media_masculino", 0.0, "media_feminino", 0.0);
        }

        return medias;
    }
}
