CREATE VIEW usuarios_sem_plano AS SELECT
                                      u.nome
                                  FROM
                                      usuario u
                                          LEFT JOIN
                                      assinatura_assina a ON u.usuario_id = a.fk_usuario_id
                                          LEFT JOIN
                                      plano p ON a.fk_plano_tipo_do_plano = p.tipo_do_plano
                                  WHERE
                                      a.fk_usuario_id IS NULL;


CREATE VIEW vw_detalhes_avaliacao AS
SELECT
    u.nome AS nome_usuario,
    o.nome AS titulo_obra,
    g.nome AS nome_genero,
    a.nota,
    a.data_avaliacao,
    a.texto AS comentario_avaliacao
FROM
    avaliacao a
        INNER JOIN
    usuario u ON a.fk_usuario_id = u.usuario_id
        INNER JOIN
    obra o ON a.fk_obra_codigo = o.codigo
        INNER JOIN
    genero g ON o.fk_genero_genero_PK = g.genero_PK
WHERE
    a.nota IS NOT NULL;