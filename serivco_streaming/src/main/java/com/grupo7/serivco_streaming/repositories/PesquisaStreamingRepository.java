package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.PesquisaStreaming;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
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

// Assumindo que você tem uma classe PesquisaStreaming
// e que 'jdbc' é uma instância de JdbcTemplate

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

    // DELETE
    public int delete(int id) {
        return jdbc.update("DELETE FROM pesquisa_streaming WHERE id_resposta = ?", id);
    }
}