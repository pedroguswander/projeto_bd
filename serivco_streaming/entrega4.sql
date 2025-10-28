USE streamingatualizado;

ALTER TABLE obra ADD INDEX nome_index(nome);

ALTER TABLE genero ADD INDEX nome_index(nome);

ALTER TABLE  usuario ADD INDEX nome_index(nome);

-- Pega os usuários que não estão associados com conta
SELECT u.nome FROM usuario u LEFT JOIN conta c ON u.usuario_id = c.fk_usuario_id WHERE c.fk_usuario_id is null;

CREATE VIEW usuarios_sem_plano AS SELECT -- Pega os usuários que não estão associados com plano
    u.nome
FROM
    usuario u
        LEFT JOIN
    assinatura_assina a ON u.usuario_id = a.fk_usuario_id
        LEFT JOIN
    plano p ON a.fk_plano_tipo_do_plano = p.tipo_do_plano
WHERE
    a.fk_usuario_id IS NULL;