package com.grupo7.serivco_streaming.repositories;

import com.grupo7.serivco_streaming.dto.Conta; // Importe o novo modelo
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper; // Usado para mapear resultados para o POJO
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.support.GeneratedKeyHolder; // Para pegar o ID gerado no INSERT
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class ContaRepository {

    private final SimpleJdbcCall atualizarStatusCall;
    private final JdbcTemplate jdbc;

    // SQLs para o CRUD (sem data_criacao)
    private static final String SQL_INSERT = "INSERT INTO conta (data_expiracao, icone, status_assinatura, fk_usuario_id, fk_administrador_id) VALUES (?, ?, ?, ?, ?)";
    private static final String SQL_UPDATE = "UPDATE conta SET data_expiracao = ?, icone = ?, status_assinatura = ?, fk_usuario_id = ?, fk_administrador_id = ? WHERE codigo = ?";
    private static final String SQL_FIND_BY_ID = "SELECT * FROM conta WHERE codigo = ?";
    private static final String SQL_FIND_ALL = "SELECT * FROM conta";
    private static final String SQL_DELETE_BY_ID = "DELETE FROM conta WHERE codigo = ?";


    @Autowired
    public ContaRepository(DataSource dataSource, JdbcTemplate jdbc) {
        this.atualizarStatusCall = new SimpleJdbcCall(dataSource)
                .withProcedureName("ATUALIZAR_STATUS_CONTA");
        this.jdbc = jdbc;
    }

    // ### MÉTODOS EXISTENTES ###

    public List<Map<String, Object>> buscarTodasContasDetalhesSemDTO() {
        String sql = "SELECT u.nome, u.email, u.usuario_id, c.data_expiracao, c.status_assinatura, c.codigo " +
                "FROM usuario u JOIN conta c ON u.usuario_id = c.fk_usuario_id";
        return jdbc.queryForList(sql);
    }

    public void atualizarStatusConta(int usuarioId, String novoStatus) {
        java.util.Map<String, Object> params = new java.util.HashMap<>();
        params.put("p_usuario_id", usuarioId);
        params.put("p_novo_status", novoStatus);

        try {
            atualizarStatusCall.execute(params);
        } catch (org.springframework.dao.DataAccessException e) {
            if (e.getMessage() != null && e.getMessage().contains("Status de assinatura inválido")) {
                throw new IllegalArgumentException("O status fornecido é inválido: " + novoStatus, e);
            }
            throw e;
        }
    }

    // ### NOVOS MÉTODOS CRUD ###

    /**
     * CREATE (Insert)
     * Insere uma nova conta e retorna o objeto Conta com o ID gerado.
     */
    public Conta create(Conta conta) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(SQL_INSERT, Statement.RETURN_GENERATED_KEYS);
            ps.setDate(1, conta.getDataExpiracao());
            ps.setString(2, conta.getIcone());
            ps.setString(3, conta.getStatusAssinatura());
            ps.setObject(4, conta.getFkUsuarioId());
            ps.setObject(5, conta.getFkAdministradorId());
            return ps;
        }, keyHolder);

        // Define o ID gerado no objeto conta
        if (keyHolder.getKey() != null) {
            conta.setCodigo(keyHolder.getKey().intValue());
        }
        return conta;
    }

    /**
     * READ (Select by ID)
     * Busca uma conta pelo seu 'codigo'.
     */
    public Optional<Conta> findById(int id) {
        try {
            Conta conta = jdbc.queryForObject(SQL_FIND_BY_ID,
                    new BeanPropertyRowMapper<>(Conta.class),
                    id);
            return Optional.ofNullable(conta);
        } catch (EmptyResultDataAccessException e) {
            // Retorna vazio se o ID não for encontrado
            return Optional.empty();
        }
    }

    /**
     * READ (Select All)
     * Retorna uma lista de todas as contas.
     */
    public List<Conta> findAll() {
        return jdbc.query(SQL_FIND_ALL, new BeanPropertyRowMapper<>(Conta.class));
    }

    /**
     * UPDATE (Update)
     * Atualiza uma conta existente com base no 'codigo'.
     */
    public int update(Conta conta) {
        // Retorna o número de linhas afetadas
        return jdbc.update(SQL_UPDATE,
                conta.getDataExpiracao(),
                conta.getIcone(),
                conta.getStatusAssinatura(),
                conta.getFkUsuarioId(),
                conta.getFkAdministradorId(),
                conta.getCodigo());
    }

    /**
     * DELETE (Delete)
     * Deleta uma conta pelo 'codigo'.
     */
    public int deleteById(int id) {
        // Retorna o número de linhas afetadas
        return jdbc.update(SQL_DELETE_BY_ID, id);
    }
}