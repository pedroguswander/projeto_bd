package com.grupo7.serivco_streaming.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource; // Importa o DataSource
import java.util.List;
import java.util.Map;

/**
 * Repository responsável pelas operações de persistência da Conta,
 * utilizando chamada direta a Stored Procedures.
 */
@Repository
public class ContaRepository {

    private final SimpleJdbcCall atualizarStatusCall;
    private final JdbcTemplate jdbc;

    @Autowired
    // Injete o DataSource para inicializar o SimpleJdbcCall
    // O Spring Boot configura o DataSource automaticamente
    public ContaRepository(DataSource dataSource, JdbcTemplate jdbc) {
        // Configura o SimpleJdbcCall para chamar a Stored Procedure
        this.atualizarStatusCall = new SimpleJdbcCall(dataSource)
                .withProcedureName("ATUALIZAR_STATUS_CONTA");
        this.jdbc = jdbc;
    }

    /**
     * Chama a Stored Procedure ATUALIZAR_STATUS_CONTA para atualizar o status
     * da assinatura de um usuário.
     *
     * @param usuarioId O ID do usuário cuja conta será atualizada.
     * @param novoStatus O novo status da assinatura ('Ativa', 'Pendente', etc.).
     * @return O número de linhas afetadas (retornado implicitamente pela procedure,
     * mas o método execute do SimpleJdbcCall retorna void ou um mapa vazio).
     * Em DMLs (UPDATE/DELETE), geralmente é verificado se a chamada não gerou uma exceção.
     */

    public List<Map<String, Object>> buscarTodasContasDetalhesSemDTO() {
        String sql = "SELECT u.nome, u.email, u.usuario_id, c.data_expiracao, c.status_assinatura, c.codigo " +
                "FROM usuario u JOIN conta c ON u.usuario_id = c.fk_usuario_id";

        // O método queryForList() executa a SQL e retorna o resultado
        // em um formato genérico (List<Map<String, Object>>).
        return jdbc.queryForList(sql);
    }

    public void atualizarStatusConta(int usuarioId, String novoStatus) {

        // Crie um Map contendo os parâmetros de entrada da Stored Procedure
        // As chaves devem corresponder aos nomes dos parâmetros (case-insensitive para o MySQL)
        java.util.Map<String, Object> params = new java.util.HashMap<>();
        params.put("p_usuario_id", usuarioId);
        params.put("p_novo_status", novoStatus);

        try {
            // Executa a Stored Procedure
            // O SimpleJdbcCall trata a conexão e a chamada SQL por baixo dos panos.
            atualizarStatusCall.execute(params);

            // Se a procedure retornar a exceção SQLSTATE '45000' (Erro: Status de assinatura inválido),
            // uma exceção do Spring DataAccess (como BadSqlGrammarException ou similar) será lançada.

        } catch (org.springframework.dao.DataAccessException e) {
            // Você pode capturar e re-lançar uma exceção de negócio mais amigável aqui.
            // Exemplo:
            if (e.getMessage() != null && e.getMessage().contains("Status de assinatura inválido")) {
                throw new IllegalArgumentException("O status fornecido é inválido: " + novoStatus, e);
            }
            throw e; // Re-lança outras exceções de acesso a dados
        }
    }
}
