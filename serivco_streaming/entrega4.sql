USE streamingatualizado;

ALTER TABLE obra ADD INDEX nome_index(nome);

ALTER TABLE genero ADD INDEX nome_index(nome);

ALTER TABLE  usuario ADD INDEX nome_index(nome);

-- Pega os usuários que não estão associados com conta
SELECT u.nome FROM usuario u LEFT JOIN conta c ON u.usuario_id = c.fk_usuario_id WHERE c.fk_usuario_id is null;

( -- Usuarios que não responderam a pesquisa

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
        u.usuario_id, -- Será NULL para os registros que só estão em pesquisa_streaming
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
        u.usuario_id IS NULL -- Seleciona apenas as linhas que *não* tiveram correspondência no primeiro JOIN
       OR ps.fk_usuario_id IS NULL -- Inclui as respostas onde o FK é NULL (se for o caso)
);


SELECT u.nome FROM usuario u WHERE usuario_id in -- Nomes dos usuarios que assistem de 4 a mais horas semanalmente
    (SELECT fk_usuario_id FROM pesquisa_streaming WHERE horas_semanais in ('Até 4 horas', 'Mais que 4 horas'));


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
    usuario u ON a.fk_usuario_id = u.usuario_id -- JOIN 1: Conecta Avaliação ao Usuário
        INNER JOIN
    obra o ON a.fk_obra_codigo = o.codigo       -- JOIN 2: Conecta Avaliação à Obra
        INNER JOIN
    genero g ON o.fk_genero_genero_PK = g.genero_PK -- JOIN 3: Conecta Obra ao Gênero
WHERE
    a.nota IS NOT NULL; -- Incluindo um filtro pertinente, para garantir que só avaliações com nota sejam exibid
