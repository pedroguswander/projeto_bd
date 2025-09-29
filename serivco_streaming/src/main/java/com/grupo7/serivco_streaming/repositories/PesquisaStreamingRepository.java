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
        p.email = rs.getString("email");
        p.ocupacao = rs.getString("ocupacao");
        p.regiaoResidencia = rs.getString("regiao_residencia");
        p.genero = rs.getString("genero");
        p.faixaEtaria = rs.getString("faixa_etaria");
        p.quantidadeAssinaturas = rs.getString("quantidade_assinaturas");
        p.servicosUtilizados = rs.getString("servicos_utilizados");
        p.motivosInsatisfacao = rs.getString("motivos_insatisfacao");
        p.generosAssistidos = rs.getString("generos_assistidos");
        p.frequenciaUso = rs.getString("frequencia_uso");
        p.horasSemanais = rs.getString("horas_semanais");
        p.satisfacaoGeral = (Integer) rs.getObject("satisfacao_geral");
        p.satisfacaoRecomendacoes = (Integer) rs.getObject("satisfacao_recomendacoes");
        p.dispositivosUtilizados = rs.getString("dispositivos_utilizados");
        p.precoIdealMensal = rs.getString("preco_ideal_mensal");
        return p;
    };

    // CREATE
    public int insert(PesquisaStreaming p) {
        String sql = """
            INSERT INTO pesquisa_streaming (email, ocupacao, regiao_residencia, genero, faixa_etaria,
            quantidade_assinaturas, servicos_utilizados, motivos_insatisfacao, generos_assistidos,
            frequencia_uso, horas_semanais, satisfacao_geral, satisfacao_recomendacoes,
            dispositivos_utilizados, preco_ideal_mensal)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        KeyHolder kh = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, p.email);
            ps.setString(2, p.ocupacao);
            ps.setString(3, p.regiaoResidencia);
            ps.setString(4, p.genero);
            ps.setString(5, p.faixaEtaria);
            ps.setString(6, p.quantidadeAssinaturas);
            ps.setString(7, p.servicosUtilizados);
            ps.setString(8, p.motivosInsatisfacao);
            ps.setString(9, p.generosAssistidos);
            ps.setString(10, p.frequenciaUso);
            ps.setString(11, p.horasSemanais);
            if (p.satisfacaoGeral == null) ps.setNull(12, java.sql.Types.INTEGER);
            else ps.setInt(12, p.satisfacaoGeral);
            if (p.satisfacaoRecomendacoes == null) ps.setNull(13, java.sql.Types.INTEGER);
            else ps.setInt(13, p.satisfacaoRecomendacoes);
            ps.setString(14, p.dispositivosUtilizados);
            ps.setString(15, p.precoIdealMensal);
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