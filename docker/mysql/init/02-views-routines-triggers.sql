USE StreamingAtualizado2;

ALTER TABLE obra ADD INDEX nome_index(nome);
ALTER TABLE genero ADD INDEX nome_index(nome);
ALTER TABLE usuario ADD INDEX nome_index(nome);

DROP VIEW IF EXISTS usuarios_sem_plano;
CREATE VIEW usuarios_sem_plano AS
SELECT u.nome
FROM usuario u
LEFT JOIN assinatura_assina a ON u.usuario_id = a.fk_usuario_id
LEFT JOIN plano p ON a.fk_plano_tipo_do_plano = p.tipo_do_plano
WHERE a.fk_usuario_id IS NULL;

DROP VIEW IF EXISTS vw_detalhes_avaliacao;
CREATE VIEW vw_detalhes_avaliacao AS
SELECT
    u.nome AS nome_usuario,
    o.nome AS titulo_obra,
    g.nome AS nome_genero,
    a.nota,
    a.data_avaliacao,
    a.texto AS comentario_avaliacao
FROM avaliacao a
INNER JOIN conta c ON c.codigo = a.fk_conta_cod
INNER JOIN usuario u ON c.fk_usuario_id = u.usuario_id
INNER JOIN obra o ON a.fk_obra_codigo = o.codigo
INNER JOIN genero g ON o.fk_genero_genero_PK = g.genero_PK
WHERE a.nota IS NOT NULL;

DROP VIEW IF EXISTS analise_valor_plano;
CREATE VIEW analise_valor_plano AS
WITH
UsoPorPlano AS (
    SELECT
        P.tipo_do_plano,
        COALESCE(SUM(HV.tempo_assistido), 0) AS total_horas_assistidas,
        COUNT(DISTINCT U.usuario_id) AS total_usuarios_no_plano
    FROM plano P
    JOIN assinatura_assina A ON P.tipo_do_plano = A.fk_plano_tipo_do_plano
    JOIN usuario U ON A.fk_usuario_id = U.usuario_id
    JOIN conta C ON U.usuario_id = C.fk_usuario_id
    LEFT JOIN historico_de_visualizacao HV ON C.codigo = HV.fk_conta_cod
    GROUP BY P.tipo_do_plano
),
ReclamacoesPorPlano AS (
    SELECT
        P.tipo_do_plano,
        COUNT(R.fk_reclamacao_pk) AS total_reclamacoes
    FROM plano P
    JOIN assinatura_assina A ON P.tipo_do_plano = A.fk_plano_tipo_do_plano
    JOIN usuario U ON A.fk_usuario_id = U.usuario_id
    LEFT JOIN reclama R ON U.usuario_id = R.fk_usuario_id
    GROUP BY P.tipo_do_plano
),
PesquisaPorPlano AS (
    SELECT
        P.tipo_do_plano,
        AVG(PS.satisfacao_geral) AS media_satisfacao
    FROM plano P
    JOIN assinatura_assina A ON P.tipo_do_plano = A.fk_plano_tipo_do_plano
    JOIN usuario U ON A.fk_usuario_id = U.usuario_id
    LEFT JOIN pesquisa_streaming PS ON U.usuario_id = PS.fk_usuario_id
    WHERE PS.satisfacao_geral IS NOT NULL
    GROUP BY P.tipo_do_plano
)
SELECT
    P.tipo_do_plano AS Plano,
    P.preco AS Preco_Relativo,
    P.qnt_de_telas_simultaneas AS Telas_Simultaneas,
    CASE
        WHEN UP.total_usuarios_no_plano > 0 THEN UP.total_horas_assistidas / UP.total_usuarios_no_plano
        ELSE 0
    END AS Media_Horas_por_Usuario,
    CASE
        WHEN UP.total_usuarios_no_plano > 0 THEN COALESCE(RP.total_reclamacoes / UP.total_usuarios_no_plano, 0)
        ELSE 0
    END AS Indice_Reclamacao_por_Usuario,
    COALESCE(PP.media_satisfacao, 0) AS Satisfacao_Geral_Pesquisa
FROM plano P
LEFT JOIN UsoPorPlano UP ON P.tipo_do_plano = UP.tipo_do_plano
LEFT JOIN ReclamacoesPorPlano RP ON P.tipo_do_plano = RP.tipo_do_plano
LEFT JOIN PesquisaPorPlano PP ON P.tipo_do_plano = PP.tipo_do_plano;

CREATE TABLE IF NOT EXISTS log_reclamacoes (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    reclamacao_id INT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acao VARCHAR(10) NOT NULL
);

DROP FUNCTION IF EXISTS CLASSIFICAR_PLANO_POR_PRECO;
DROP FUNCTION IF EXISTS CALCULAR_MEDIA_OBRA;
DROP FUNCTION IF EXISTS ATUALIZAR_STATUS_DA_CONTA;
DROP PROCEDURE IF EXISTS ATUALIZAR_STATUS_CONTA;
DROP PROCEDURE IF EXISTS AJUSTAR_PROGRESSO_CONCLUIDO;
DROP PROCEDURE IF EXISTS ObterMetricasVisualizacaoObra;
DROP TRIGGER IF EXISTS log_nova_reclamacao;
DROP TRIGGER IF EXISTS log_delete_reclamacao;
DROP TRIGGER IF EXISTS impedir_avaliacao_dupla;
DROP TRIGGER IF EXISTS prevent_duplicate_obra;

DELIMITER $$

CREATE FUNCTION CLASSIFICAR_PLANO_POR_PRECO(preco_plano DECIMAL(10,2))
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE classificacao VARCHAR(20);

    CASE
        WHEN preco_plano >= 50.00 THEN SET classificacao = 'Premium/Alto';
        WHEN preco_plano >= 35.00 THEN SET classificacao = 'Padrao/Medio';
        ELSE SET classificacao = 'Basico/Baixo';
    END CASE;

    RETURN classificacao;
END$$

CREATE FUNCTION CALCULAR_MEDIA_OBRA(codigo_obra INT)
RETURNS DECIMAL(3, 2)
READS SQL DATA
BEGIN
    DECLARE media_nota DECIMAL(3, 2);

    SELECT ROUND(AVG(nota), 2)
    INTO media_nota
    FROM avaliacao
    WHERE fk_obra_codigo = codigo_obra;

    RETURN COALESCE(media_nota, 0.00);
END$$

CREATE FUNCTION ATUALIZAR_STATUS_DA_CONTA(p_usuario_id INT, p_novo_status VARCHAR(50))
RETURNS INT
DETERMINISTIC
MODIFIES SQL DATA
BEGIN
    DECLARE v_linhas_afetadas INT;

    IF p_novo_status NOT IN ('Ativa', 'Pendente', 'Cancelada', 'Expirada') THEN
        RETURN 0;
    END IF;

    UPDATE conta
    SET status_assinatura = p_novo_status
    WHERE fk_usuario_id = p_usuario_id;

    SET v_linhas_afetadas = ROW_COUNT();
    RETURN IF(v_linhas_afetadas > 0, 1, -1);
END$$

CREATE PROCEDURE ATUALIZAR_STATUS_CONTA(
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
            SET MESSAGE_TEXT = 'Erro: Status de assinatura invalido.';
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

CREATE PROCEDURE ObterMetricasVisualizacaoObra(
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
END$$

CREATE TRIGGER log_nova_reclamacao
AFTER INSERT ON reclama
FOR EACH ROW
BEGIN
    INSERT INTO log_reclamacoes (usuario_id, reclamacao_id, acao)
    VALUES (NEW.fk_usuario_id, NEW.fk_reclamacao_pk, 'INSERT');
END$$

CREATE TRIGGER log_delete_reclamacao
BEFORE DELETE ON reclama
FOR EACH ROW
BEGIN
    INSERT INTO log_reclamacoes (usuario_id, reclamacao_id, acao)
    VALUES (OLD.fk_usuario_id, OLD.fk_reclamacao_pk, 'DELETE');
END$$

CREATE TRIGGER impedir_avaliacao_dupla
BEFORE INSERT ON avaliacao
FOR EACH ROW
BEGIN
    DECLARE num_avaliacoes INT;

    SELECT COUNT(*)
    INTO num_avaliacoes
    FROM avaliacao
    WHERE fk_conta_cod = NEW.fk_conta_cod
      AND fk_obra_codigo = NEW.fk_obra_codigo;

    IF num_avaliacoes > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Erro: Esta conta ja avaliou esta obra.';
    END IF;
END$$

CREATE TRIGGER prevent_duplicate_obra
BEFORE INSERT ON obra
FOR EACH ROW
BEGIN
    DECLARE nome_count INT;

    SELECT COUNT(*)
    INTO nome_count
    FROM obra
    WHERE nome = NEW.nome;

    IF nome_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'ERRO: Nao e permitido inserir obras com nomes duplicados.';
    END IF;
END$$

DELIMITER ;
