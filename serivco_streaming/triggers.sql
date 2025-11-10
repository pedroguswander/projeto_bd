/*
 TRIGGERS:
- log_delete_reclamacao: Feedback são dados valisos e sensíveis sobre os usuários pois auxiliam no crescimento da plataforma e na implementação de melhorias. Por isso, é preciso de um back-up para guardar esses dados sensíveis em caso de sinistros

- impedir_avaliacao_dupla: Implementa uma regra de negócio em que uma conta só pode avaliar uma vez. Isso impede que uma conta altere a tendencia central de notas de uma obra com sua opinião extrema
 */

CREATE TABLE IF NOT EXISTS log_reclamacoes (
                                               log_id INT PRIMARY KEY AUTO_INCREMENT,
                                               usuario_id INT NOT NULL,
                                               reclamacao_id INT NOT NULL,
                                               data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                               acao VARCHAR(10) NOT NULL
);

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


DELIMITER $$

CREATE TRIGGER log_delete_reclamacao

    BEFORE DELETE ON reclama
    FOR EACH ROW
BEGIN

    INSERT INTO log_reclamacoes (usuario_id, reclamacao_id, acao)
    VALUES (OLD.fk_usuario_id, OLD.fk_reclamacao_pk, 'DELETE');


    END$$

DELIMITER ;