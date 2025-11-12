package com.grupo7.serivco_streaming.repositories;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class HistoricoVisualizacaoRepository {

    private final JdbcTemplate jdbc;

    public HistoricoVisualizacaoRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Implementação Java da procedure AJUSTAR_PROGRESSO_CONCLUIDO.
     * Atualiza todos os progressos >= 99.50 e < 100 para 100.00.
     * @return O número de linhas afetadas.
     */
    public int ajustarProgressoConcluido() {
        String sql = """
            UPDATE historico_de_visualizacao
            SET progresso_percentual = 100.00
            WHERE progresso_percentual >= 99.50 AND progresso_percentual < 100.00
        """;
        return jdbc.update(sql);
    }
}