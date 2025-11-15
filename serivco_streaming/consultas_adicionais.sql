CREATE VIEW analise_valor_plano AS
WITH
-- 1. CTE: Calcula o Uso Total e o número de Usuários por Plano (para médias)
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

-- 2. CTE: Conta o total de Reclamações por Plano
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

-- 3. CTE: Calcula a Satisfação Média da Pesquisa por Plano
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

-- Consulta Principal que combina todas as métricas
SELECT
    P.tipo_do_plano AS Plano,
    P.preco AS Preco_Relativo,
    P.qnt_de_telas_simultaneas AS Telas_Simultaneas,

    -- Métrica: Média de Horas por Usuário
    CASE
        WHEN UP.total_usuarios_no_plano > 0
            THEN UP.total_horas_assistidas / UP.total_usuarios_no_plano
        ELSE 0
        END AS Media_Horas_por_Usuario,

    -- Métrica: Índice de Reclamação por Usuário
    CASE
        WHEN UP.total_usuarios_no_plano > 0
            THEN COALESCE(RP.total_reclamacoes / UP.total_usuarios_no_plano, 0)
        ELSE 0
        END AS Indice_Reclamacao_por_Usuario,

    -- Métrica: Satisfação Geral na Pesquisa
    COALESCE(PP.media_satisfacao, 0) AS Satisfacao_Geral_Pesquisa

FROM plano P
         LEFT JOIN UsoPorPlano UP ON P.tipo_do_plano = UP.tipo_do_plano
         LEFT JOIN ReclamacoesPorPlano RP ON P.tipo_do_plano = RP.tipo_do_plano
         LEFT JOIN PesquisaPorPlano PP ON P.tipo_do_plano = PP.tipo_do_plano;

SELECT * FROM analise_valor_plano;