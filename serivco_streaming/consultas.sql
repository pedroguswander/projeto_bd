SELECT o.nome FROM obra o JOIN genero g ON o.fk_genero_genero_PK = g.genero_PK WHERE g.nome=?

SELECT * FROM obra WHERE nome LIKE ?

SELECT * FROM usuario WHERE bairro = ?

SELECT * FROM usuario WHERE email = ?

INSERT INTO obra (fk_genero_genero_PK, nome, sinopse, data_lancamento, qnt_temporadas, duracao, obra_TIPO) " +
   "VALUES (?, ?, ?, ?, ?, ?, ?)

INSERT INTO usuario
(fk_reclamacoes_reclamacoes_PK, rua, bairro, numero, nome, email, senha)
VALUES (?, ?, ?, ?, ?, ?, ?)

DELETE FROM usuario WHERE usuario_id = ?
DELETE FROM obra WHERE codigo = ?

UPDATE usuario
SET fk_reclamacoes_reclamacoes_PK = ?,
    rua = ?,
    bairro = ?,
    numero = ?,
    nome = ?,
    email = ?,
    senha = ?
WHERE usuario_id = ?

UPDATE obra SET fk_genero_genero_PK = ?, nome = ?, sinopse = ?, data_lancamento = ?, " +
       "qnt_temporadas = ?, duracao = ?, obra_TIPO = ? WHERE codigo = ?
