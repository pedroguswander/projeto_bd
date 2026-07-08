package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.PesquisaRawDTO;
import com.grupo7.serivco_streaming.dto.PesquisaStreaming;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.nio.charset.StandardCharsets;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Repository
public class PesquisaStreamingRepository {

    private final JdbcTemplate jdbc;

    public PesquisaStreamingRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<PesquisaStreaming> mapper = (rs, rowNum) -> {
        PesquisaStreaming p = new PesquisaStreaming();

        p.idResposta = rs.getInt("id_resposta");
        p.fk_usuario_id = rs.getInt("fk_usuario_id");
        p.email = rs.getString("email");
        p.ocupacao = rs.getString("ocupacao");
        p.regiaoResidencia = rs.getString("regiao_residencia");
        p.genero = rs.getString("genero");
        p.faixaEtaria = rs.getString("faixa_etaria");

        // CORREÃ‡ÃƒO: Usar o nome da coluna SQL: qtd_assinaturas
        p.quantidadeAssinaturas = rs.getString("qtd_assinaturas");

        p.servicosUtilizados = rs.getString("servicos_utilizados");

        // CORREÃ‡ÃƒO: Usar o nome da coluna SQL: motivo_insatisfacao
        p.motivosInsatisfacao = rs.getString("motivo_insatisfacao");

        p.generosAssistidos = rs.getString("generos_assistidos");
        p.frequenciaUso = rs.getString("frequencia_uso");
        p.horasSemanais = rs.getString("horas_semanais");

        // OK: rs.getObject retorna Integer, tratando corretamente o NULL
        p.satisfacaoGeral = (Integer) rs.getObject("satisfacao_geral");
        p.satisfacaoRecomendacoes = (Integer) rs.getObject("satisfacao_recomendacao");

        p.dispositivosUtilizados = rs.getString("dispositivos_utilizados");

        // CORREÃ‡ÃƒO: Usar o nome da coluna SQL: preco_ideal_menos
        p.precoIdealMensal = rs.getString("preco_ideal_menos");

        return p;
    };

    public List<PesquisaRawDTO> getPrecoIdealEQuantidadeAssinaturas() {
        String sql = "SELECT preco_ideal_menos, qtd_assinaturas FROM pesquisa_streaming";
        return jdbc.query(sql, new BeanPropertyRowMapper<>(PesquisaRawDTO.class));
    }

    public Map<String, Double> getMediaSatisfacaoPorGenero() {
        String sqlMasculino = "SELECT AVG(satisfacao_geral) FROM pesquisa_streaming WHERE genero = 'Masculino'";
        String sqlFeminino = "SELECT AVG(satisfacao_geral) FROM pesquisa_streaming WHERE genero = 'Feminino'";
        Map<String, Double> medias = new HashMap<>();

        try {
            Double mediaMasculino = jdbc.queryForObject(sqlMasculino, Double.class);
            Double mediaFeminino = jdbc.queryForObject(sqlFeminino, Double.class);
            medias.put("media_masculino", mediaMasculino != null ? mediaMasculino : 0.0);
            medias.put("media_feminino", mediaFeminino != null ? mediaFeminino : 0.0);
        } catch (Exception e) {
            System.err.println("Erro ao calcular a mÃ©dia de satisfaÃ§Ã£o por gÃªnero: " + e.getMessage());
            return Map.of("media_masculino", 0.0, "media_feminino", 0.0);
        }
        return medias;
    }
    public Map<String, Long> getStreamingHoursCountsByValue() {
        String sql = """
            SELECT
                horas_semanais,
                COUNT(*) as contagem
            FROM
                pesquisa_streaming
            WHERE
                horas_semanais IS NOT NULL
                AND horas_semanais <> ''
            GROUP BY
                horas_semanais
            """;

        Map<String, Long> totals = new LinkedHashMap<>();
        for (String label : horasSemanaisOrdenadas()) {
            totals.put(label, 0L);
        }

        jdbc.query(sql, rs -> {
            String horas = normalizarHorasSemanais(rs.getString("horas_semanais"));
            Long count = rs.getLong("contagem");
            totals.merge(horas, count, Long::sum);
        });

        totals.entrySet().removeIf(entry -> entry.getValue() == 0L);
        return totals;
    }
    // =================================================================================
    // MÃ‰TODO INSERT CORRIGIDO
    // =================================================================================
    public int insert(PesquisaStreaming p) {
        String sql = """
    INSERT INTO pesquisa_streaming (fk_usuario_id ,email, ocupacao, regiao_residencia, genero, faixa_etaria,
    qtd_assinaturas, servicos_utilizados, motivo_insatisfacao, generos_assistidos,
    frequencia_uso, horas_semanais, satisfacao_geral, satisfacao_recomendacao,
    dispositivos_utilizados, preco_ideal_menos)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """;
        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            // Garantir que campos NOT NULL tenham valor
            String email = p.email == null ? "" : p.email; // Assumindo que email Ã© NOT NULL
            String motivo = p.motivosInsatisfacao;

            // 1. fk_usuario_id (NOT NULL)
            ps.setInt(1, p.fk_usuario_id);

            // 2. email (NOT NULL)
            ps.setString(2, email);

            // --- CAMPOS QUE ACEITAM NULL ---
            // Agora que o DDL SQL aceita NULL, podemos passar o valor do DTO diretamente.
            // O JDBC (ps.setString) saberÃ¡ como enviar NULL se o valor for null.

            // 3. ocupacao (NULL)
            ps.setString(3, p.ocupacao);

            // 4. regiao_residencia (NULL)
            ps.setString(4, p.regiaoResidencia);

            // 5. genero (NULL)
            ps.setString(5, p.genero);

            // 6. faixa_etaria (NULL)
            ps.setString(6, p.faixaEtaria);

            // 7. qtd_assinaturas (NULL)
            ps.setString(7, p.quantidadeAssinaturas);

            // 8. servicos_utilizados (NULL)
            ps.setString(8, p.servicosUtilizados);

            // 9. motivo_insatisfacao (TEXT NULL) - Tratamento especial para ""
            if (motivo == null || motivo.trim().isEmpty()) {
                ps.setNull(9, java.sql.Types.VARCHAR);
            } else {
                ps.setString(9, motivo);
            }

            // 10. generos_assistidos (NULL)
            ps.setString(10, p.generosAssistidos);

            // 11. frequencia_uso (NULL)
            ps.setString(11, p.frequenciaUso);

            // 12. horas_semanais (NULL)
            ps.setString(12, p.horasSemanais);

            // 13. satisfacao_geral (INT NULL) - CORREÃ‡ÃƒO CRÃTICA
            if (p.satisfacaoGeral == null) {
                ps.setNull(13, java.sql.Types.INTEGER); // <-- CORRIGIDO
            } else {
                ps.setInt(13, p.satisfacaoGeral);
            }

            // 14. satisfacao_recomendacao (INT NULL)
            if (p.satisfacaoRecomendacoes == null) {
                ps.setNull(14, java.sql.Types.INTEGER);
            } else {
                ps.setInt(14, p.satisfacaoRecomendacoes);
            }

            // 15. dispositivos_utilizados (NULL)
            ps.setString(15, p.dispositivosUtilizados);

            // 16. preco_ideal_menos (NULL)
            ps.setString(16, p.precoIdealMensal);

            return ps;
        }, kh);
        Number key = kh.getKey();
        return key == null ? 0 : key.intValue();
    }
    // =================================================================================
    // FIM DO MÃ‰TODO INSERT CORRIGIDO
    // =================================================================================


    // READ
    public List<PesquisaStreaming> findAll() {
        return jdbc.query("SELECT * FROM pesquisa_streaming", mapper);
    }

    public Optional<PesquisaStreaming> findById(int id) {
        try {
            PesquisaStreaming p = jdbc.queryForObject("SELECT * FROM pesquisa_streaming WHERE id_resposta = ?", mapper, id);
            return Optional.ofNullable(p);
        } catch (DataAccessException e) {
            return Optional.empty();
        }
    }

    public boolean existsById(int id) {
        Integer c = jdbc.queryForObject("SELECT COUNT(*) FROM pesquisa_streaming WHERE id_resposta = ?", Integer.class, id);
        return c != null && c > 0;
    }

    public boolean existsByEmail(String email) {
        Integer c = jdbc.queryForObject("SELECT COUNT(*) FROM pesquisa_streaming WHERE email = ?", Integer.class, email);
        return c != null && c > 0;
    }

    // UPDATE
    public int update(int id, PesquisaStreaming p) {
        // O mÃ©todo update tambÃ©m deve ser verificado para tratar NULLs se vocÃª usÃ¡-lo
        String sql = """
            UPDATE pesquisa_streaming SET email = ?, ocupacao = ?, regiao_residencia = ?, genero = ?,
            faixa_etaria = ?, qtd_assinaturas = ?, servicos_utilizados = ?, motivo_insatisfacao = ?,
            generos_assistidos = ?, frequencia_uso = ?, horas_semanais = ?, satisfacao_geral = ?,
            satisfacao_recomendacoes = ?, dispositivos_utilizados = ?, preco_ideal_menos = ?
            WHERE id_resposta = ?
        """;
        // NOTA: O update abaixo estÃ¡ passando os valores do DTO diretamente.
        // Se algum for null, o JDBC tentarÃ¡ enviar NULL.
        // Isso SÃ“ funciona agora que o DDL SQL foi corrigido.
        return jdbc.update(sql, p.email, p.ocupacao, p.regiaoResidencia, p.genero, p.faixaEtaria,
                p.quantidadeAssinaturas, p.servicosUtilizados, p.motivosInsatisfacao, p.generosAssistidos,
                p.frequenciaUso, p.horasSemanais, p.satisfacaoGeral, p.satisfacaoRecomendacoes,
                p.dispositivosUtilizados, p.precoIdealMensal, id);
    }

    public int delete(int id) {
        return jdbc.update("DELETE FROM pesquisa_streaming WHERE id_resposta = ?", id);
    }

    public Map<String, Map<String, Long>> getGeneroPorAssistido() {
        String sql = """
            SELECT 
                p.genero AS genero_usuario,
                TRIM(j.genero_assistido) AS genero_assistido,
                COUNT(*) AS total
            FROM pesquisa_streaming p
            JOIN JSON_TABLE(
                CONCAT('["', REPLACE(p.generos_assistidos, ',', '","'), '"]'),
                "$[*]" COLUMNS (genero_assistido VARCHAR(255) PATH "$")
            ) j
            WHERE 
                p.genero IS NOT NULL
                AND p.genero <> ''
                AND p.generos_assistidos IS NOT NULL
                AND p.generos_assistidos <> ''
            GROUP BY 
                genero_assistido, genero_usuario
            ORDER BY 
                genero_assistido, genero_usuario
            """;

        List<Map.Entry<String, Map<String, Long>>> results = jdbc.query(sql, (rs, rowNum) -> {
            String generoAssistido = normalizarTexto(rs.getString("genero_assistido"));
            String generoUsuario = normalizarTexto(rs.getString("genero_usuario"));
            Long total = rs.getLong("total");

            return Map.entry(generoAssistido, Map.of(generoUsuario, total));
        });

        Map<String, Map<String, Long>> agrupado = new LinkedHashMap<>();
        for (Map.Entry<String, Map<String, Long>> entry : results) {
            String generoAssistido = entry.getKey();
            Map<String, Long> generoMap = agrupado.getOrDefault(generoAssistido, new HashMap<>());
            entry.getValue().forEach((genero, total) -> generoMap.merge(genero, total, Long::sum));
            agrupado.put(generoAssistido, generoMap);
        }

        return agrupado;
    }

    public Map<String, Long> getTotalPorGenero() {
        String sql = """
            SELECT genero, COUNT(*) AS total
            FROM pesquisa_streaming
            WHERE genero IS NOT NULL AND genero <> ''
            GROUP BY genero
        """;

        List<Map<String, Object>> rows = jdbc.queryForList(sql);

        Map<String, Long> totals = new HashMap<>();
        for (Map<String, Object> row : rows) {
            String genero = (String) row.get("genero");
            Long total = ((Number) row.get("total")).longValue();
            totals.put(genero, total);
        }

        return totals;
    }

    public Map<String, Map<String, Long>> getGeneroPorHorasSemanais() {
        String sql = """
            SELECT
                p.horas_semanais AS horas_assistidas,
                TRIM(j.genero_assistido) AS genero_assistido,
                COUNT(*) AS total
            FROM pesquisa_streaming p
            JOIN JSON_TABLE(
                CONCAT('["', REPLACE(p.generos_assistidos, ',', '","'), '"]'),
                "$[*]" COLUMNS (genero_assistido VARCHAR(255) PATH "$")
            ) j
            WHERE
                p.horas_semanais IS NOT NULL
                AND p.horas_semanais <> ''
                AND p.generos_assistidos IS NOT NULL
                AND p.generos_assistidos <> ''
            GROUP BY
                horas_assistidas, genero_assistido
            ORDER BY
                horas_assistidas, genero_assistido
            """;

        List<Map.Entry<String, Map<String, Long>>> results = jdbc.query(sql, (rs, rowNum) -> {
            String horasAssistidas = normalizarHorasSemanais(rs.getString("horas_assistidas"));
            String generoAssistido = normalizarTexto(rs.getString("genero_assistido"));
            Long total = rs.getLong("total");

            return Map.entry(horasAssistidas, Map.of(generoAssistido, total));
        });

        Map<String, Map<String, Long>> agrupado = new LinkedHashMap<>();
        for (String label : horasSemanaisOrdenadas()) {
            agrupado.put(label, new HashMap<>());
        }

        for (Map.Entry<String, Map<String, Long>> entry : results) {
            String horasAssistidas = entry.getKey();
            Map<String, Long> generoMap = agrupado.getOrDefault(horasAssistidas, new HashMap<>());
            entry.getValue().forEach((genero, total) -> generoMap.merge(genero, total, Long::sum));
            agrupado.put(horasAssistidas, generoMap);
        }

        agrupado.entrySet().removeIf(entry -> entry.getValue().isEmpty());
        return agrupado;
    }

    private List<String> horasSemanaisOrdenadas() {
        return List.of("Raramente", "At\u00e9 2 horas", "At\u00e9 4 horas", "Mais que 4 horas");
    }

    private String normalizarHorasSemanais(String value) {
        String texto = normalizarTexto(value).trim();

        if (texto.matches("\\d+(,\\d+)?")) {
            double horas = Double.parseDouble(texto.replace(',', '.'));
            if (horas <= 2) {
                return "At\u00e9 2 horas";
            }
            if (horas <= 4) {
                return "At\u00e9 4 horas";
            }
            return "Mais que 4 horas";
        }

        String lower = texto.toLowerCase(Locale.ROOT);
        if (lower.contains("raramente")) {
            return "Raramente";
        }
        if (lower.contains("mais") || lower.contains("> 4")) {
            return "Mais que 4 horas";
        }
        if (lower.contains("menos") || lower.contains("at\u00e9 2") || lower.contains("ate 2")) {
            return "At\u00e9 2 horas";
        }
        if (lower.contains("at\u00e9 4") || lower.contains("ate 4")) {
            return "At\u00e9 4 horas";
        }

        return texto;
    }

    private String normalizarTexto(String value) {
        if (value == null) {
            return "";
        }

        String texto = value;
        for (int i = 0; i < 3 && (texto.contains("\u00c3") || texto.contains("\u00c2")); i++) {
            texto = new String(texto.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
        }

        texto = texto
                .replace("\u00c3\u00a1", "\u00e1")
                .replace("\u00c3\u00a2", "\u00e2")
                .replace("\u00c3\u00a3", "\u00e3")
                .replace("\u00c3\u00a9", "\u00e9")
                .replace("\u00c3\u00aa", "\u00ea")
                .replace("\u00c3\u00ad", "\u00ed")
                .replace("\u00c3\u00b3", "\u00f3")
                .replace("\u00c3\u00b4", "\u00f4")
                .replace("\u00c3\u00ba", "\u00fa")
                .replace("\u00c3\u00a7", "\u00e7");

        return texto;
    }

    public Map<String, Map<String, Long>> getDispositivosPorGeneroAssistido() {
        String sql = """
            SELECT
                TRIM(j_genero.genero_assistido) AS genero_assistido,
                TRIM(j_dispositivo.dispositivo_utilizado) AS dispositivo_utilizado,
                COUNT(*) AS total
            FROM pesquisa_streaming p
            
            -- Desagrega 'generos_assistidos'
            JOIN JSON_TABLE(
                CONCAT('["', REPLACE(p.generos_assistidos, ',', '","'), '"]'),
                "$[*]" COLUMNS (genero_assistido VARCHAR(255) PATH "$")
            ) j_genero
            
            -- Desagrega 'dispositivos_utilizados'
            JOIN JSON_TABLE(
                CONCAT('["', REPLACE(p.dispositivos_utilizados, ',', '","'), '"]'),
                "$[*]" COLUMNS (dispositivo_utilizado VARCHAR(255) PATH "$")
            ) j_dispositivo
            
            WHERE
                p.generos_assistidos IS NOT NULL
                AND p.generos_assistidos <> ''
                AND p.dispositivos_utilizados IS NOT NULL
                AND p.dispositivos_utilizados <> ''
            GROUP BY
                genero_assistido, dispositivo_utilizado
            ORDER BY
                genero_assistido, total DESC
            """;

        List<Map.Entry<String, Map<String, Long>>> results = jdbc.query(sql, (rs, rowNum) -> {
            String generoAssistido = normalizarTexto(rs.getString("genero_assistido"));
            String dispositivoUtilizado = normalizarDispositivo(rs.getString("dispositivo_utilizado"));
            Long total = rs.getLong("total");

            return Map.entry(generoAssistido, Map.of(dispositivoUtilizado, total));
        });

        Map<String, Map<String, Long>> agrupado = new HashMap<>();
        for (Map.Entry<String, Map<String, Long>> entry : results) {
            String generoAssistido = entry.getKey();
            Map<String, Long> dispositivoMap = agrupado.getOrDefault(generoAssistido, new HashMap<>());
            entry.getValue().forEach((dispositivo, total) -> dispositivoMap.merge(dispositivo, total, Long::sum));
            agrupado.put(generoAssistido, dispositivoMap);
        }

        return agrupado;
    }

    private String normalizarDispositivo(String value) {
        String texto = normalizarTexto(value).trim().replaceAll("^\"|\"$", "");

        if (texto.equalsIgnoreCase("TV")) {
            return "TV";
        }
        if (texto.equalsIgnoreCase("Smartphone")) {
            return "Smartphone";
        }
        if (texto.equalsIgnoreCase("Computador/Notebook")) {
            return "Computador/Notebook";
        }
        if (texto.equalsIgnoreCase("Tablet")) {
            return "Tablet";
        }
        if (texto.toLowerCase(Locale.ROOT).contains("chromecast")
                || texto.toLowerCase(Locale.ROOT).contains("fire tv")
                || texto.toLowerCase(Locale.ROOT).contains("dispositivo de streaming")) {
            return "Streaming Dongle";
        }

        return texto;
    }
}
