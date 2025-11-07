USE StreamingAtualizado2;

CREATE TABLE IF NOT EXISTS log_reclamacoes (
                                               log_id INT PRIMARY KEY AUTO_INCREMENT,
                                               usuario_id INT NOT NULL,
                                               reclamacao_id INT NOT NULL,
                                               data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                               acao VARCHAR(10) NOT NULL
);

DELIMITER $$

CREATE FUNCTION CLASSIFICAR_PLANO_POR_PRECO (
    preco_plano DECIMAL(10,2)
)
    RETURNS VARCHAR(20)
    DETERMINISTIC
BEGIN
    DECLARE classificacao VARCHAR(20);

    CASE
        WHEN preco_plano >= 50.00 THEN
            SET classificacao = 'Premium/Alto';
        WHEN preco_plano >= 35.00 THEN
            SET classificacao = 'Padrão/Médio';
        ELSE
            SET classificacao = 'Básico/Baixo';
        END CASE;

    RETURN classificacao;
END$$

CREATE FUNCTION CALCULAR_MEDIA_OBRA (
    codigo_obra INT
)
    RETURNS DECIMAL(3, 2)
    READS SQL DATA
BEGIN
    DECLARE media_nota DECIMAL(3, 2);

    SELECT
        ROUND(AVG(nota), 2)
    INTO
        media_nota
    FROM
        avaliacao
    WHERE
        fk_obra_codigo = codigo_obra;

    RETURN COALESCE(media_nota, 0.00);
END$$

CREATE PROCEDURE ATUALIZAR_STATUS_CONTA (
    IN p_usuario_id INT,
    IN p_novo_status VARCHAR(50)
)
BEGIN
    IF p_novo_status IN ('Ativa', 'Pendente', 'Cancelada', 'Expirada') THEN
        UPDATE conta
        SET status_assinatura = p_novo_status
        WHERE fk_usuario_id = p_usuario_id;
    ELSE
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erro: Status de assinatura inválido.';
    END IF;
END$$

CREATE PROCEDURE AJUSTAR_PROGRESSO_CONCLUIDO()
BEGIN
    DECLARE done INT DEFAULT 0;
    -- v_usuario_id precisa ser mudada para v_conta_cod
    DECLARE v_conta_cod INT;
    DECLARE v_obra_codigo INT;

    DECLARE cur CURSOR FOR
        -- fk_usuario_id precisa ser mudada para fk_conta_cod
        SELECT fk_conta_cod, fk_obra_codigo
        FROM historico_de_visualizacao
        WHERE progresso_percentual >= 99.50 AND progresso_percentual < 100.00;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        -- FETCH cur INTO v_usuario_id, v_obra_codigo; precisa ser mudada para v_conta_cod
        FETCH cur INTO v_conta_cod, v_obra_codigo;
        IF done THEN
            LEAVE read_loop;
        END IF;

        UPDATE historico_de_visualizacao
        SET progresso_percentual = 100.00
        -- O WHERE precisa ser ajustado para fk_conta_cod
        WHERE fk_conta_cod = v_conta_cod AND fk_obra_codigo = v_obra_codigo;

    END LOOP;

    CLOSE cur;

END$$

CREATE TRIGGER log_nova_reclamacao
    AFTER INSERT ON reclama
    FOR EACH ROW
BEGIN
    INSERT INTO log_reclamacoes (usuario_id, reclamacao_id, acao)
    VALUES (NEW.fk_usuario_id, NEW.fk_reclamacao_pk, 'INSERT');
END$$

CREATE TRIGGER impedir_avaliacao_dupla
    BEFORE INSERT ON avaliacao
    FOR EACH ROW
BEGIN
    DECLARE num_avaliacoes INT;

    SELECT COUNT(*)
    INTO num_avaliacoes
    FROM avaliacao
    WHERE fk_usuario_id = NEW.fk_usuario_id
      AND fk_obra_codigo = NEW.fk_obra_codigo;

    IF num_avaliacoes > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erro: Este usuário já avaliou esta obra. Não é permitida avaliação duplicada.';
    END IF;
END$$

DELIMITER ;

-- DELIMITER é usado para permitir que o corpo do trigger contenha ponto e vírgula
DELIMITER //

CREATE TRIGGER prevent_duplicate_obra
    BEFORE INSERT ON obra
    FOR EACH ROW
BEGIN
    DECLARE nome_count INT;

    -- Verifica se já existe uma obra com o mesmo nome (case-insensitive)
    SELECT COUNT(*)
    INTO nome_count
    FROM obra
    WHERE nome = NEW.nome;

    -- Se a contagem for maior que 0, significa que o nome já existe
    IF nome_count > 0 THEN
        -- Sinaliza um erro para impedir a inserção da linha
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'ERRO: Nao e permitido inserir obras com nomes duplicados.';
    END IF;
END //

-- Retorna o delimitador ao padrão (ponto e vírgula)
DELIMITER ;

CREATE PROCEDURE ObterMetricasVisualizacaoObra (
    IN obra_codigo_param INT,
    OUT total_horas_assistidas DECIMAL(10,2),
    OUT total_contas_assistindo INT
)
BEGIN
    -- 1. Calcula o total de horas assistidas para a obra
    SELECT COALESCE(SUM(tempo_assistido), 0.00)
    INTO total_horas_assistidas
    FROM historico_de_visualizacao
    WHERE fk_obra_codigo = obra_codigo_param;

    -- 2. Conta a quantidade de contas que assistiram a obra (tendo registro no histórico)
    SELECT COUNT(DISTINCT fk_conta_cod)
    INTO total_contas_assistindo
    FROM historico_de_visualizacao
    WHERE fk_obra_codigo = obra_codigo_param;
END;



SELECT '--- TESTE FUNÇÕES ---' AS Info;
SELECT tipo_do_plano, preco, CLASSIFICAR_PLANO_POR_PRECO(preco) AS Nivel FROM plano;
SELECT nome, CALCULAR_MEDIA_OBRA(codigo) AS Nota_Media FROM obra WHERE codigo = 1;

-- Teste de Procedimento (ATUALIZAR_STATUS_CONTA):
-- CALL ATUALIZAR_STATUS_CONTA(1, 'Cancelada');
-- SELECT status_assinatura FROM conta WHERE fk_usuario_id = 1;
-- CALL ATUALIZAR_STATUS_CONTA(1, 'Ativa'); -- Reverter

-- teste do procedimento (com cursor):
-- CALL AJUSTAR_PROGRESSO_CONCLUIDO();
-- SELECT progresso_percentual FROM historico_de_visualizacao WHERE fk_usuario_id = 1 AND fk_obra_codigo = 1;

-- Teste do Trigger (log_nova_reclamacao):
-- INSERT INTO reclama (fk_usuario_id, fk_reclamacao_pk) VALUES (1, 25);
-- SELECT * FROM log_reclamacoes ORDER BY log_id DESC LIMIT 1;
-- DELETE FROM reclama WHERE fk_usuario_id = 1 AND fk_reclamacao_pk = 25; -- Limpa o dado de teste
-- DELETE FROM log_reclamacoes WHERE usuario_id = 1 AND reclamacao_id = 25; -- Limpa o log

-- Teste do Trigger (impedir_avaliacao_dupla):
-- O comando ABAIXO deve falhar (gerar um erro de sinalização):
-- INSERT INTO avaliacao (fk_usuario_id, fk_obra_codigo, nota, data_avaliacao, texto) VALUES (1, 1, 1, '2025-11-04', 'Teste duplicado');