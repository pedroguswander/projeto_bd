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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    public Map<String, Object> obterMetricasVisualizacao(int codigoObra) {

        // 1. Chama a Stored Procedure.
        String callProcedureSql =
                "CALL ObterMetricasVisualizacaoObra(?, @horas, @contas)";

        jdbc.update(callProcedureSql, codigoObra);

        // 2. Recupera os valores de saída das variáveis de sessão.
        String selectVariablesSql =
                "SELECT @horas AS totalHorasAssistidas, @contas AS totalContasAssistindo";

        // Usando queryForMap para retornar diretamente um Map da única linha de resultado.
        // O Spring fará o mapeamento automático dos tipos (DECIMAL para Double, INT para Integer).
        return jdbc.queryForMap(selectVariablesSql);
    }

    public List<Map<String, Object>> calcularMedias(Integer obraCodigo) {
        // A query calcula a média das notas agrupada por obra.
        // LEFT JOIN é usado para incluir obras que não têm avaliações (AVG resultará em NULL).
        String sqlBase = """
            SELECT
                o.codigo,
                o.nome,
                -- Garante que o valor nulo (sem avaliações) ou a média seja retornado formatado
                COALESCE(CAST(AVG(a.nota) AS DECIMAL(3, 2)), 0.00) AS media_nota
            FROM
                obra o
            LEFT JOIN
                avaliacao a ON o.codigo = a.fk_obra_codigo
        """;

        StringBuilder sqlBuilder = new StringBuilder(sqlBase);
        List<Object> params = new ArrayList<>();

        // Adiciona a cláusula WHERE se um filtro de obra for fornecido
        if (obraCodigo != null) {
            // O filtro é aplicado aqui, antes do GROUP BY
            sqlBuilder.append(" WHERE o.codigo = ? ");
            params.add(obraCodigo);
        }

        // Agrupa e ordena
        sqlBuilder.append(" GROUP BY o.codigo, o.nome ORDER BY o.codigo");

        // Utiliza queryForList, que retorna List<Map<String, Object>>, eliminando a necessidade de DTO.
        return jdbc.queryForList(sqlBuilder.toString(), params.toArray());
    }

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

    public List<Map<String, Object>> findDistribuicaoPorGenero() {
        // A consulta SQL que utilizamos anteriormente
        String sql = "SELECT " +
                "    g.nome AS genero, " +
                "    COUNT(o.codigo) AS total_obras " +
                "FROM " +
                "    genero g " +
                "JOIN " +
                "    obra o ON g.genero_PK = o.fk_genero_genero_PK " +
                "GROUP BY " +
                "    g.nome " +
                "ORDER BY " +
                "    total_obras DESC LIMIT 5";

        // Usamos queryForList para retornar uma List<Map<String, Object>> bruta
        // sem a necessidade de RowMapper.
        return jdbc.queryForList(sql);
    }

    public List<String> getUsuariosSemPlano() {
        return jdbc.queryForList("SELECT * from usuarios_sem_plano", String.class);
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

    public Optional<Obra> findByName(String nome) {
        try {
            Obra o = jdbc.queryForObject("SELECT * FROM obra WHERE nome = ?", mapper, nome);
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

    public List<String> findByGenero(String nome) {
        String sql = "SELECT o.nome FROM obra o JOIN genero g ON o.fk_genero_genero_PK = g.genero_PK WHERE g.nome=?";
        return jdbc.queryForList(sql, String.class, nome);
    }

    public List<Obra> findByNomeContaining(String busca) {
        String sql = "SELECT * FROM obra WHERE nome LIKE ?";
        return jdbc.query(sql, mapper, "%" + busca + "%");
    }

    public List<Obra> findByDataLancamento(LocalDate data) {
        String sql = "SELECT * FROM obra WHERE data_lancamento = ?";
        return jdbc.query(sql, mapper, data);
    }
}