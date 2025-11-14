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

        DECLARE v_conta_cod INT;
        DECLARE v_obra_codigo INT;

        DECLARE cur CURSOR FOR

            SELECT fk_conta_cod, fk_obra_codigo
            FROM historico_de_visualizacao
            WHERE progresso_percentual >= 99.50 AND progresso_percentual < 100.00;

        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

        OPEN cur;

        read_loop: LOOP

            FETCH cur INTO v_conta_cod, v_obra_codigo;
            IF done THEN
                LEAVE read_loop;
            END IF;

            UPDATE historico_de_visualizacao
            SET progresso_percentual = 100.00

            WHERE fk_conta_cod = v_conta_cod AND fk_obra_codigo = v_obra_codigo;

        END LOOP;

        CLOSE cur;

        END$$

DELIMITER ;

CREATE PROCEDURE ObterMetricasVisualizacaoObra (
    IN obra_codigo_param INT,
    OUT total_horas_assistidas DECIMAL(10,2),
    OUT total_contas_assistindo INT
)
BEGIN

    SELECT COALESCE(SUM(tempo_assistido), 0.00)
    INTO total_horas_assistidas
    FROM historico_de_visualizacao
    WHERE fk_obra_codigo = obra_codigo_param;

    SELECT COUNT(DISTINCT fk_conta_cod)
    INTO total_contas_assistindo
    FROM historico_de_visualizacao
    WHERE fk_obra_codigo = obra_codigo_param;
END;