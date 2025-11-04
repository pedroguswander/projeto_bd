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

SELECT nome, email FROM usuario WHERE
    usuario_id IN (
        SELECT DISTINCT
            fk_usuario_id
        FROM
            avaliacao
        WHERE
            nota IS NOT NULL
          AND nota > 0
    );


SELECT u.nome FROM usuario u WHERE usuario_id in
                                   (SELECT fk_usuario_id FROM pesquisa_streaming WHERE horas_semanais in ('Até 4 horas', 'Mais que 4 horas'));