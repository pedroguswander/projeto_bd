/*
 FUNÇÕES:
- CALCULAR_MEDIA_OBRA: Escolhemos criar essa função para implementar uma funcionalidade essencial no sistema de gerenciamento da nossa plataforma de streaming "fictícia", que é obter a média de notas das obras. Isso é crucial para a equipe de decisões estratégicas da plataforma receberem insights (potencializados por meio do dashboard) sobre as obras que são mais e menos relevantes. A partir disso, esse time sabe quais obras deve manter no catálogo e quais podem ter menor prioridade de continuarem no catálogo

- ATUALIZAR_STATUS_DA_CONTA: Função de extrema importância para implementar uma funcionalidade de controle de status de contas na plataforma. Se um usuário deixou de pagar, é importante que seja desconectado da plataforma ou caso um usuário abra uma conta, é importante mudar o status para "ativado" e permitir o acesso do usuário da plataforma
 */

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

CREATE FUNCTION ATUALIZAR_STATUS_DA_CONTA (
    p_usuario_id INT,
    p_novo_status VARCHAR(50)
)
    RETURNS INT
    DETERMINISTIC
BEGIN
    DECLARE v_linhas_afetadas INT;


    IF p_novo_status NOT IN ('Ativa', 'Pendente', 'Cancelada', 'Expirada') THEN

        RETURN 0;
    END IF;


    UPDATE conta
    SET status_assinatura = p_novo_status
    WHERE fk_usuario_id = p_usuario_id;


    SET v_linhas_afetadas = ROW_COUNT();


    IF v_linhas_afetadas > 0 THEN

        RETURN 1;
    ELSE

        RETURN -1;
    END IF;
END$$

DELIMITER ;