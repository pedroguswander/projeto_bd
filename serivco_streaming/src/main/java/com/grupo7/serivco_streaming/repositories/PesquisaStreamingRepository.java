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

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

        // CORREÇÃO: Usar o nome da coluna SQL: qtd_assinaturas
        p.quantidadeAssinaturas = rs.getString("qtd_assinaturas");

        p.servicosUtilizados = rs.getString("servicos_utilizados");

        // CORREÇÃO: Usar o nome da coluna SQL: motivo_insatisfacao
        p.motivosInsatisfacao = rs.getString("motivo_insatisfacao");

        p.generosAssistidos = rs.getString("generos_assistidos");
        p.frequenciaUso = rs.getString("frequencia_uso");
        p.horasSemanais = rs.getString("horas_semanais");

        // OK: rs.getObject retorna Integer, tratando corretamente o NULL
        p.satisfacaoGeral = (Integer) rs.getObject("satisfacao_geral");
        p.satisfacaoRecomendacoes = (Integer) rs.getObject("satisfacao_recomendacao");

        p.dispositivosUtilizados = rs.getString("dispositivos_utilizados");

        // CORREÇÃO: Usar o nome da coluna SQL: preco_ideal_menos
        p.precoIdealMensal = rs.getString("preco_ideal_menos");

        return p;
    };

    public List<PesquisaRawDTO> getPrecoIdealEQuantidadeAssinaturas() {
        // SQL para selecionar apenas as colunas necessárias
        String sql = "SELECT preco_ideal_menos, qtd_assinaturas FROM pesquisa_streaming";

        // Usamos BeanPropertyRowMapper para mapear o resultado (snake_case)
        // para o nosso DTO (camelCase) automaticamente.
        return jdbc.query(sql, new BeanPropertyRowMapper<>(PesquisaRawDTO.class));
    }

// Assumindo que você tem uma classe PesquisaStreaming
// e que 'jdbc' é uma instância de JdbcTemplate
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

    public Map<String, Long> getStreamingHoursCountsByValue() {
        // A consulta SQL: seleciona o valor literal e conta quantas vezes ele aparece.
        String sql = """
            SELECT 
                horas_semanais, 
                COUNT(*) as contagem 
            FROM 
                pesquisa_streaming 
            WHERE 
                horas_semanais IN ('Menos de 2 horas', 'Até 2 horas', 'Até 4 horas', 'Mais que 4 horas') 
            GROUP BY 
                horas_semanais
            """;

        // Mapeador de Linha para a combinação de horas_semanais (String) e COUNT (Long)
        List<Map.Entry<String, Long>> results = jdbc.query(sql, (rs, rowNum) -> {
            String horas = rs.getString("horas_semanais");
            Long count = rs.getLong("contagem");
            return Map.entry(horas, count);
        });

        // Converte a lista de entradas (entries) em um mapa (Map<String, Long>)
        return results.stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue
                ));
    }

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

            // Funções auxiliares para evitar repetição (Java 8+)
            // Trata null em Strings: Se o valor for null, usa uma string vazia ("")
            // Se a coluna for NOT NULL no BD, "" é melhor que null, que geraria exceção.
            // AS PROPRIEDADES AGORA SÃO ACESSADAS DIRETAMENTE (p.propriedade)
            String regiao = p.regiaoResidencia == null ? "" : p.regiaoResidencia;
            String faixa = p.faixaEtaria == null ? "" : p.faixaEtaria;
            String qtdAss = p.quantidadeAssinaturas == null ? "" : p.quantidadeAssinaturas;
            String servicos = p.servicosUtilizados == null ? "" : p.servicosUtilizados;
            String generos = p.generosAssistidos == null ? "" : p.generosAssistidos;
            String freq = p.frequenciaUso == null ? "" : p.frequenciaUso;
            String horas = p.horasSemanais == null ? "" : p.horasSemanais;
            String disp = p.dispositivosUtilizados == null ? "" : p.dispositivosUtilizados;
            String preco = p.precoIdealMensal == null ? "" : p.precoIdealMensal;

            // ** A coluna motivo_insatisfacao DEVE ser tratada com setNull se puder ser NULL no BD **
            String motivo = p.motivosInsatisfacao;

            // 1. fk_usuario_id
            ps.setInt(1, p.fk_usuario_id);

            // 2. email
            ps.setString(2, p.email == null ? "" : p.email);

            // 3. ocupacao
            ps.setString(3, p.ocupacao == null ? "" : p.ocupacao);

            // 4. regiao_residencia
            ps.setString(4, regiao);

            // 5. genero
            ps.setString(5, p.genero == null ? "" : p.genero);

            // 6. faixa_etaria
            ps.setString(6, faixa);

            // 7. qtd_assinaturas
            ps.setString(7, qtdAss);

            // 8. servicos_utilizados
            ps.setString(8, servicos);

            // 9. motivo_insatisfacao (Permite NULL, usa setNull se a string for nula ou vazia)
            if (motivo == null || motivo.trim().isEmpty()) {
                ps.setNull(9, java.sql.Types.VARCHAR);
            } else {
                ps.setString(9, motivo);
            }

            // 10. generos_assistidos
            ps.setString(10, generos);

            // 11. frequencia_uso
            ps.setString(11, freq);

            // 12. horas_semanais
            ps.setString(12, horas);

            // 13. satisfacao_geral
            if (p.satisfacaoGeral == null) ps.setInt(13, java.sql.Types.INTEGER);
            else ps.setInt(13, p.satisfacaoGeral);

            // 14. satisfacao_recomendacao
            if (p.satisfacaoRecomendacoes == null) ps.setNull(14, java.sql.Types.INTEGER);
            else ps.setInt(14, p.satisfacaoRecomendacoes);

            // 15. dispositivos_utilizados
            ps.setString(15, disp);

            // 16. preco_ideal_menos
            ps.setString(16, preco);

            return ps;
        }, kh);
        Number key = kh.getKey();
        return key == null ? 0 : key.intValue();
    }

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
        String sql = """
            UPDATE pesquisa_streaming SET email = ?, ocupacao = ?, regiao_residencia = ?, genero = ?,
            faixa_etaria = ?, quantidade_assinaturas = ?, servicos_utilizados = ?, motivos_insatisfacao = ?,
            generos_assistidos = ?, frequencia_uso = ?, horas_semanais = ?, satisfacao_geral = ?,
            satisfacao_recomendacoes = ?, dispositivos_utilizados = ?, preco_ideal_mensal = ?
            WHERE id_resposta = ?
        """;
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
                CONCAT('[\"', REPLACE(p.generos_assistidos, ',', '\",\"'), '\"]'),
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
            String generoAssistido = rs.getString("genero_assistido");
            String generoUsuario = rs.getString("genero_usuario");
            Long total = rs.getLong("total");

            return Map.entry(generoAssistido, Map.of(generoUsuario, total));
        });

        Map<String, Map<String, Long>> agrupado = new HashMap<>();
        for (Map.Entry<String, Map<String, Long>> entry : results) {
            String generoAssistido = entry.getKey();
            Map<String, Long> generoMap = agrupado.getOrDefault(generoAssistido, new HashMap<>());
            generoMap.putAll(entry.getValue());
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


}