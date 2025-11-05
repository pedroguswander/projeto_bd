USE streamingatualizado2;

ALTER TABLE obra ADD INDEX nome_index(nome);

ALTER TABLE genero ADD INDEX nome_index(nome);

ALTER TABLE  usuario ADD INDEX nome_index(nome);


SELECT u.nome FROM usuario u LEFT JOIN conta c ON u.usuario_id = c.fk_usuario_id WHERE c.fk_usuario_id is null;

(

    SELECT
        u.usuario_id,
        u.nome AS nome_usuario,
        u.email AS email_usuario,
        ps.id_resposta,
        ps.horas_semanais,
        ps.satisfacao_geral,
        ps.motivo_insatisfacao,
        ps.genero AS genero_pesquisa,
        ps.faixa_etaria
    FROM
        usuario u
            LEFT JOIN
        pesquisa_streaming ps ON u.usuario_id = ps.fk_usuario_id
)
UNION
(
    SELECT
        u.usuario_id,
        u.nome AS nome_usuario,
        u.email AS email_usuario,
        ps.id_resposta,
        ps.horas_semanais,
        ps.satisfacao_geral,
        ps.motivo_insatisfacao,
        ps.genero AS genero_pesquisa,
        ps.faixa_etaria
    FROM
        pesquisa_streaming ps
            LEFT JOIN
        usuario u ON ps.fk_usuario_id = u.usuario_id
    WHERE
        u.usuario_id IS NULL
       OR ps.fk_usuario_id IS NULL
);

SELECT
    u.nome,
    u.email
FROM
    usuario u
        INNER JOIN
    conta c ON u.usuario_id = c.fk_usuario_id -- Junta usuário com a sua conta
WHERE
    c.codigo IN ( -- Filtra as contas cujo código está na subconsulta
        SELECT DISTINCT
            fk_conta_cod -- Seleciona os códigos de conta distintos
        FROM
            avaliacao -- Da tabela avaliação
        WHERE
            nota IS NOT NULL
          AND nota > 0 -- Onde a nota não é nula e é maior que 0
    );


SELECT u.nome FROM usuario u WHERE usuario_id in
    (SELECT fk_usuario_id FROM pesquisa_streaming WHERE horas_semanais in ('Até 4 horas', 'Mais que 4 horas'));


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
        conta c ON c.codigo=a.fk_conta_cod
        INNER JOIN
    usuario u ON c.fk_usuario_id = u.usuario_id
        INNER JOIN
    obra o ON a.fk_obra_codigo = o.codigo
        INNER JOIN
    genero g ON o.fk_genero_genero_PK = g.genero_PK
WHERE
    a.nota IS NOT NULL;
