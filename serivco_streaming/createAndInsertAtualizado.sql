--
-- ESQUEMA COMPLETO COM MODIFICAÇÕES
--

create database streaming2;

use streaming2;

-- Tabela reclamacoes
CREATE TABLE reclamacoes (
                             id INT,
                             fk_usuario_ID INT,
                             tipo CHAR(50),
                             descricao CHAR(255),
                             dataReclamacao DATE
);

-- Tabela genero
CREATE TABLE genero (
                        genero_PK INT NOT NULL,
                        genero CHAR(50)
);

CREATE TABLE conta (
                       cod INT,
                       icone CHAR(50),
                       statusAssinatura CHAR(50),
                       dataExpiracao DATE
);

CREATE TABLE Usuario (
                         ID INT,
                         Nome CHAR(100),
                         Senha CHAR(50),
                         email CHAR(100),
                         rua CHAR(100),
                         numero CHAR(10),
                         bairro CHAR(100),
                         reclamacoes CHAR(255),
                         fk_pesquisa_email INT
);

CREATE TABLE Plano (
                       tipoPlano INT, -- Alterado para INT para simplificar a FK, apesar de CHAR no schema original
                       qtdTelas INT,
                       preco FLOAT,
                       possuiAnuncio BOOLEAN
);

CREATE TABLE Assinatura_Assina (
                                   fk_Usuario_ID INT,
                                   fk_Plano_tipoPlano INT
);

CREATE TABLE diretor (
                         DataNasc DATE,
                         Nome CHAR(100)
);

CREATE TABLE episodio (
                          numero INT,
                          numeroTemporada INT,
                          duracao TIME,
                          id INT,
                          fk_serie_COD INT
);

CREATE TABLE obra (
                      COD INT,
                      Nome CHAR(100),
                      DataExp DATE,
                      Sinopse CHAR(255),
                      DataLanc DATE,
                      fk_genero_genero INT,
                      qtdTemporadas INT,
                      duracao TIME,
                      obra_TIPO INT
);

CREATE TABLE historicoVisualizacao (
                                       progressoPercentual FLOAT,
                                       tempoAssistido FLOAT,
                                       fk_conta_cod INT
);

CREATE TABLE listaFavoritos (
                                ordemExibicao CHAR(10),
                                qtdObras INT,
                                fk_conta_cod INT
);

CREATE TABLE pesquisa (
                          email CHAR(100),
                          preco_ideal_mensal INT,
                          quantidade_assinatura CHAR(50),
                          generos_assistidos CHAR(255),
                          faixa_etaria CHAR(50),
                          ocupacao CHAR(100),
                          dispositivos_utilizados_FK INT,
                          servicos_utilizados_FK INT,
                          regiao_residencia CHAR(100),
                          satisfacao_geral INT,
                          satisfacao_recomendacao INT,
                          motivos_insatisfacao CHAR(255),
                          frequencia_uso CHAR(50),
                          genero CHAR(50),
                          horas_semanais CHAR(50)
);

CREATE TABLE dispositivos_utilizados (
                                         dispositivos_utilizados_PK INT NOT NULL,
                                         dispositivos_utilizados CHAR(100)
);

CREATE TABLE servicos_utilizados (
                                     servicos_utilizados_PK INT NOT NULL,
                                     servicos_utilizados CHAR(100)
);

CREATE TABLE administra (
                            conta_A_cod INT,
                            conta_B_cod INT
);

CREATE TABLE avalia (
                        fk_conta_cod INT,
                        fk_obra_COD INT,
                        nota INT,
                        data DATE,
                        comentario_FK INT,
                        texto CHAR(255)
);

CREATE TABLE comentario (
                            comentario_PK INT NOT NULL,
                            comentario CHAR(255)
);

CREATE TABLE dirige (
                        fk_obra_COD INT
);

CREATE TABLE assiste (
                         fk_conta_cod INT,
                         fk_obra_COD INT
);


--
-- INSERÇÃO DE 30 TUPLAS EM CADA TABELA (EXCETO USUARIO E PESQUISA)
--

-- Tabela genero (Necessária para OBRA)
INSERT INTO genero (genero_PK, genero) VALUES
                                           (1, 'Ação'), (2, 'Comédia'), (3, 'Drama'), (4, 'Terror'), (5, 'Ficção Científica'),
                                           (6, 'Romance'), (7, 'Documentário'), (8, 'Aventura'), (9, 'Crime'), (10, 'Fantasia'),
                                           (11, 'Musical'), (12, 'Suspense'), (13, 'Guerra'), (14, 'Western'), (15, 'Biografia'),
                                           (16, 'Histórico'), (17, 'Animação'), (18, 'Infantil'), (19, 'Esportes'), (20, 'Curta-metragem'),
                                           (21, 'Novela'), (22, 'Reality Show'), (23, 'Mistério'), (24, 'Show'), (25, 'Stand-up'),
                                           (26, 'Viagem'), (27, 'Culinária'), (28, 'Saúde'), (29, 'Educação'), (30, 'Outros');

-- Tabela Plano (Necessária para Assinatura_Assina)
INSERT INTO Plano (tipoPlano, qtdTelas, preco, possuiAnuncio) VALUES
                                                                  (1, 1, 21.90, FALSE), (2, 2, 34.90, FALSE), (3, 4, 47.90, FALSE), (4, 1, 15.90, TRUE), (5, 2, 25.90, TRUE),
                                                                  (6, 4, 35.90, TRUE), (7, 1, 19.90, FALSE), (8, 2, 29.90, FALSE), (9, 4, 39.90, FALSE), (10, 1, 12.90, TRUE),
                                                                  (11, 2, 22.90, TRUE), (12, 4, 32.90, TRUE), (13, 1, 20.00, FALSE), (14, 2, 30.00, FALSE), (15, 4, 40.00, FALSE),
                                                                  (16, 1, 15.00, TRUE), (17, 2, 25.00, TRUE), (18, 4, 35.00, TRUE), (19, 1, 22.00, FALSE), (20, 2, 33.00, FALSE),
                                                                  (21, 4, 44.00, FALSE), (22, 1, 17.00, TRUE), (23, 2, 27.00, TRUE), (24, 4, 37.00, TRUE), (25, 1, 23.00, FALSE),
                                                                  (26, 2, 35.00, FALSE), (27, 4, 45.00, FALSE), (28, 1, 16.00, TRUE), (29, 2, 26.00, TRUE), (30, 4, 36.00, TRUE);

-- Tabela obra (Necessária para episodio, avalia, dirige, assiste)
INSERT INTO obra (COD, Nome, DataExp, Sinopse, DataLanc, fk_genero_genero, qtdTemporadas, duracao, obra_TIPO) VALUES
                                                                                                                  (101, 'Projeto Alfa', '2026-01-01', 'Sinopse 1', '2023-01-01', 5, 2, '02:00:00', 1),
                                                                                                                  (102, 'O Segredo da Ilha', '2026-02-01', 'Sinopse 2', '2022-03-15', 8, 3, '00:45:00', 2),
                                                                                                                  (103, 'Riso Sem Limites', '2025-12-31', 'Sinopse 3', '2024-05-20', 2, 1, '01:30:00', 1),
                                                                                                                  (104, 'O Código Perdido', '2026-03-01', 'Sinopse 4', '2021-11-10', 9, 4, '00:50:00', 2),
                                                                                                                  (105, 'Estrelas Cadentes', '2025-11-01', 'Sinopse 5', '2023-07-01', 6, 1, '01:45:00', 1),
                                                                                                                  (106, 'A Muralha', '2026-04-01', 'Sinopse 6', '2022-09-01', 13, 5, '00:40:00', 2),
                                                                                                                  (107, 'Lendas Urbanas', '2025-10-01', 'Sinopse 7', '2024-01-25', 4, 1, '02:10:00', 1),
                                                                                                                  (108, 'Nova Geração', '2026-05-01', 'Sinopse 8', '2023-04-05', 17, 2, '00:25:00', 2),
                                                                                                                  (109, 'Caminhos Cruzados', '2025-09-01', 'Sinopse 9', '2021-06-12', 3, 3, '01:15:00', 1),
                                                                                                                  (110, 'O Último Suspiro', '2026-06-01', 'Sinopse 10', '2024-02-29', 12, 1, '00:55:00', 2),
                                                                                                                  (111, 'Viagem no Tempo', '2025-08-01', 'Sinopse 11', '2022-05-01', 5, 2, '02:00:00', 1),
                                                                                                                  (112, 'Mistério da Floresta', '2026-07-01', 'Sinopse 12', '2023-08-10', 8, 3, '00:45:00', 2),
                                                                                                                  (113, 'Comédia Total', '2025-07-01', 'Sinopse 13', '2024-06-20', 2, 1, '01:30:00', 1),
                                                                                                                  (114, 'Polícia Secreta', '2026-08-01', 'Sinopse 14', '2021-12-10', 9, 4, '00:50:00', 2),
                                                                                                                  (115, 'Dois Corações', '2025-06-01', 'Sinopse 15', '2023-09-01', 6, 1, '01:45:00', 1),
                                                                                                                  (116, 'Trincheira', '2026-09-01', 'Sinopse 16', '2022-10-01', 13, 5, '00:40:00', 2),
                                                                                                                  (117, 'A Casa Mal-Assombrada', '2025-05-01', 'Sinopse 17', '2024-03-25', 4, 1, '02:10:00', 1),
                                                                                                                  (118, 'Robôs Amigos', '2026-10-01', 'Sinopse 18', '2023-05-05', 17, 2, '00:25:00', 2),
                                                                                                                  (119, 'Vidas em Jogo', '2025-04-01', 'Sinopse 19', '2021-07-12', 3, 3, '01:15:00', 1),
                                                                                                                  (120, 'O Desaparecimento', '2026-11-01', 'Sinopse 20', '2024-04-29', 12, 1, '00:55:00', 2),
                                                                                                                  (121, 'Planeta X', '2025-03-01', 'Sinopse 21', '2022-06-01', 5, 2, '02:00:00', 1),
                                                                                                                  (122, 'Ruínas Antigas', '2026-12-01', 'Sinopse 22', '2023-10-10', 8, 3, '00:45:00', 2),
                                                                                                                  (123, 'Stand-up do Zeca', '2025-02-01', 'Sinopse 23', '2024-07-20', 25, 1, '01:30:00', 1),
                                                                                                                  (124, 'Investigação Noturna', '2027-01-01', 'Sinopse 24', '2021-09-10', 9, 4, '00:50:00', 2),
                                                                                                                  (125, 'Amor Proibido', '2025-01-01', 'Sinopse 25', '2023-11-01', 6, 1, '01:45:00', 1),
                                                                                                                  (126, 'Campo de Batalha', '2027-02-01', 'Sinopse 26', '2022-11-01', 13, 5, '00:40:00', 2),
                                                                                                                  (127, 'A Maldição', '2024-12-01', 'Sinopse 27', '2024-05-25', 4, 1, '02:10:00', 1),
                                                                                                                  (128, 'Mundo Digital', '2027-03-01', 'Sinopse 28', '2023-06-05', 17, 2, '00:25:00', 2),
                                                                                                                  (129, 'Histórias Reais', '2024-11-01', 'Sinopse 29', '2021-08-12', 3, 3, '01:15:00', 1),
                                                                                                                  (130, 'O Último Voo', '2027-04-01', 'Sinopse 30', '2024-06-29', 12, 1, '00:55:00', 2);

-- Tabela conta (Necessária para historicoVisualizacao, listaFavoritos, administra, avalia, assiste)
INSERT INTO conta (cod, icone, statusAssinatura, dataExpiracao) VALUES
                                                                    (1, 'Gato', 'Ativa', '2026-10-01'), (2, 'Cachorro', 'Ativa', '2026-09-20'), (3, 'Estrela', 'Pendente', '2025-11-05'), (4, 'Foguete', 'Ativa', '2026-08-15'), (5, 'Ninja', 'Ativa', '2026-07-10'),
                                                                    (6, 'Coroa', 'Ativa', '2026-06-01'), (7, 'Fantasma', 'Cancelada', '2025-05-20'), (8, 'Sol', 'Ativa', '2026-04-10'), (9, 'Lua', 'Ativa', '2026-03-25'), (10, 'Coração', 'Ativa', '2026-02-14'),
                                                                    (11, 'Árvore', 'Ativa', '2026-01-01'), (12, 'Carro', 'Pendente', '2025-12-01'), (13, 'Bola', 'Ativa', '2026-11-20'), (14, 'Câmera', 'Ativa', '2026-10-15'), (15, 'Livro', 'Ativa', '2026-09-01'),
                                                                    (16, 'Máscara', 'Cancelada', '2025-08-10'), (17, 'Anel', 'Ativa', '2026-07-25'), (18, 'Mapa', 'Ativa', '2026-06-15'), (19, 'Sino', 'Ativa', '2026-05-05'), (20, 'Fogo', 'Ativa', '2026-04-20'),
                                                                    (21, 'Gelo', 'Pendente', '2025-03-30'), (22, 'Vento', 'Ativa', '2026-03-01'), (23, 'Terra', 'Ativa', '2026-02-05'), (24, 'Água', 'Ativa', '2026-01-20'), (25, 'Raio', 'Ativa', '2025-12-10'),
                                                                    (26, 'Flor', 'Cancelada', '2025-11-25'), (27, 'Trovão', 'Ativa', '2026-10-30'), (28, 'Nuvem', 'Ativa', '2026-09-15'), (29, 'Diamante', 'Ativa', '2026-08-01'), (30, 'Espada', 'Ativa', '2026-07-05');

-- Tabela diretor (Necessária para dirige)
INSERT INTO diretor (DataNasc, Nome) VALUES
                                         ('1970-01-01', 'Maria Silva'), ('1965-05-15', 'João Pereira'), ('1980-11-20', 'Ana Souza'), ('1958-03-10', 'Pedro Oliveira'), ('1975-08-25', 'Sofia Santos'),
                                         ('1985-02-02', 'Ricardo Costa'), ('1960-04-12', 'Helena Almeida'), ('1972-09-30', 'Carlos Ferreira'), ('1988-12-05', 'Laura Lima'), ('1955-06-18', 'Antônio Gomes'),
                                         ('1978-07-14', 'Beatriz Rocha'), ('1963-01-28', 'Fernando Mendes'), ('1982-10-11', 'Giovana Nunes'), ('1950-04-01', 'Manuel Barbosa'), ('1977-09-09', 'Clara Dias'),
                                         ('1983-03-21', 'Marcelo Vieira'), ('1968-11-17', 'Luciana Pinto'), ('1974-06-22', 'Rui Castro'), ('1989-05-08', 'Tania Reis'), ('1966-12-03', 'Sérgio Viana'),
                                         ('1971-02-19', 'Patrícia Lima'), ('1984-08-07', 'Diego Marques'), ('1962-09-24', 'Eva Cardoso'), ('1979-10-31', 'Guilherme Freire'), ('1986-04-16', 'Vanessa Pires'),
                                         ('1961-07-07', 'Jorge Moura'), ('1973-11-29', 'Paula Sales'), ('1987-01-26', 'Felipe Barros'), ('1969-05-03', 'Mônica Lira'), ('1990-03-14', 'Alexandre Dantas');

-- Tabela dispositivos_utilizados (Necessária para pesquisa)

-- Tabela servicos_utilizados (Necessária para pesquisa)

-- Tabela episodio
INSERT INTO episodio (numero, numeroTemporada, duracao, id, fk_serie_COD) VALUES
                                                                              (1, 1, '00:45:00', 1001, 102), (2, 1, '00:46:00', 1002, 102), (3, 1, '00:44:00', 1003, 102), (4, 1, '00:47:00', 1004, 104), (5, 1, '00:48:00', 1005, 104),
                                                                              (6, 2, '00:45:00', 1006, 104), (7, 1, '00:39:00', 1007, 106), (8, 2, '00:40:00', 1008, 106), (9, 3, '00:41:00', 1009, 106), (10, 4, '00:42:00', 1010, 106),
                                                                              (11, 1, '00:24:00', 1011, 108), (12, 2, '00:26:00', 1012, 108), (13, 1, '00:54:00', 1013, 110), (14, 1, '00:45:00', 1014, 112), (15, 2, '00:46:00', 1015, 112),
                                                                              (16, 3, '00:44:00', 1016, 112), (17, 1, '00:47:00', 1017, 114), (18, 2, '00:48:00', 1018, 114), (19, 3, '00:45:00', 1019, 114), (20, 4, '00:40:00', 1020, 114),
                                                                              (21, 1, '00:39:00', 1021, 116), (22, 2, '00:40:00', 1022, 116), (23, 3, '00:41:00', 1023, 116), (24, 4, '00:42:00', 1024, 116), (25, 1, '00:24:00', 1025, 118),
                                                                              (26, 2, '00:26:00', 1026, 118), (27, 1, '00:54:00', 1027, 120), (28, 1, '00:45:00', 1028, 122), (29, 2, '00:46:00', 1029, 122), (30, 3, '00:44:00', 1030, 122);

-- Tabela historicoVisualizacao
INSERT INTO historicoVisualizacao (progressoPercentual, tempoAssistido, fk_conta_cod) VALUES
                                                                                          (75.5, 90.5, 1), (100.0, 45.0, 2), (20.3, 15.2, 3), (95.1, 110.8, 4), (10.0, 8.5, 5),
                                                                                          (50.0, 60.0, 6), (100.0, 120.0, 7), (88.7, 75.3, 8), (35.2, 20.1, 9), (60.0, 55.0, 10),
                                                                                          (100.0, 180.0, 11), (15.5, 12.0, 12), (70.1, 95.5, 13), (99.0, 40.0, 14), (5.0, 3.5, 15),
                                                                                          (80.0, 100.0, 16), (100.0, 50.0, 17), (45.6, 35.8, 18), (92.0, 85.0, 19), (25.0, 18.0, 20),
                                                                                          (100.0, 90.0, 21), (30.5, 25.5, 22), (85.0, 70.0, 23), (10.1, 5.0, 24), (55.5, 48.9, 25),
                                                                                          (100.0, 150.0, 26), (72.0, 92.5, 27), (18.9, 11.1, 28), (98.0, 115.2, 29), (40.0, 30.0, 30);

-- Tabela listaFavoritos
INSERT INTO listaFavoritos (ordemExibicao, qtdObras, fk_conta_cod) VALUES
                                                                       ('Recente', 5, 1), ('Alfabética', 10, 2), ('Manual', 3, 3), ('Recente', 12, 4), ('Alfabética', 8, 5),
                                                                       ('Manual', 15, 6), ('Recente', 2, 7), ('Alfabética', 18, 8), ('Manual', 7, 9), ('Recente', 20, 10),
                                                                       ('Alfabética', 4, 11), ('Manual', 25, 12), ('Recente', 6, 13), ('Alfabética', 11, 14), ('Manual', 9, 15),
                                                                       ('Recente', 14, 16), ('Alfabética', 1, 17), ('Manual', 16, 18), ('Recente', 19, 19), ('Alfabética', 13, 20),
                                                                       ('Manual', 22, 21), ('Recente', 24, 22), ('Alfabética', 28, 23), ('Manual', 21, 24), ('Recente', 23, 25),
                                                                       ('Alfabética', 26, 26), ('Manual', 30, 27), ('Recente', 27, 28), ('Alfabética', 29, 29), ('Manual', 17, 30);

-- Tabela administra
INSERT INTO administra (conta_A_cod, conta_B_cod) VALUES
                                                      (1, 2), (1, 3), (2, 4), (3, 5), (4, 6),
                                                      (5, 7), (6, 8), (7, 9), (8, 10), (9, 11),
                                                      (10, 12), (11, 13), (12, 14), (13, 15), (14, 16),
                                                      (15, 17), (16, 18), (17, 19), (18, 20), (19, 21),
                                                      (20, 22), (21, 23), (22, 24), (23, 25), (24, 26),
                                                      (25, 27), (26, 28), (27, 29), (28, 30), (29, 1);

-- Tabela comentario (Necessária para avalia)
INSERT INTO comentario (comentario_PK, comentario) VALUES
                                                       (1, 'Excelente obra, recomendo!'), (2, 'Poderia ser melhor, história fraca.'), (3, 'Nota 10, muito emocionante.'), (4, 'Horrível, perdi meu tempo.'), (5, 'Bom entretenimento, mas clichê.'),
                                                       (6, 'Simplesmente perfeito, assisti duas vezes.'), (7, 'Um pouco arrastado no meio.'), (8, 'Adorei a fotografia e a trilha sonora.'), (9, 'Final previsível, mas OK.'), (10, 'Incrível! Superou minhas expectativas.'),
                                                       (11, 'Não entendi nada da história.'), (12, 'Divertido, mas nada inovador.'), (13, 'Um clássico instantâneo!'), (14, 'Atuações medianas.'), (15, 'Recomendo para quem gosta do gênero.'),
                                                       (16, 'Terror psicológico de qualidade.'), (17, 'Desenho muito bonito, pena que é curto.'), (18, 'Profundo e reflexivo.'), (19, 'Mais ou menos, passatempo.'), (20, 'Muito longo, deveria ter sido minissérie.'),
                                                       (21, 'Roteiro inteligente.'), (22, 'Cansativo de assistir.'), (23, 'Amo esse filme!'), (24, 'Cheio de furos na trama.'), (25, 'Uma linda história de amor.'),
                                                       (26, 'Muita ação, adorei!'), (27, 'Me deu medo de verdade.'), (28, 'Engraçado e descontraído.'), (29, 'Vale a pena a maratona.'), (30, 'Poderia ter um final diferente.');

-- Tabela avalia
INSERT INTO avalia (fk_conta_cod, fk_obra_COD, nota, data, comentario_FK, texto) VALUES
                                                                                     (1, 101, 5, '2024-01-05', 1, 'Excelente obra, recomendo!'), (2, 102, 3, '2024-01-10', 2, 'Poderia ser melhor, história fraca.'), (3, 103, 5, '2024-01-15', 3, 'Nota 10, muito emocionante.'),
                                                                                     (4, 104, 2, '2024-01-20', 4, 'Horrível, perdi meu tempo.'), (5, 105, 4, '2024-01-25', 5, 'Bom entretenimento, mas clichê.'), (6, 106, 5, '2024-02-01', 6, 'Simplesmente perfeito, assisti duas vezes.'),
                                                                                     (7, 107, 3, '2024-02-05', 7, 'Um pouco arrastado no meio.'), (8, 108, 5, '2024-02-10', 8, 'Adorei a fotografia e a trilha sonora.'), (9, 109, 3, '2024-02-15', 9, 'Final previsível, mas OK.'),
                                                                                     (10, 110, 5, '2024-02-20', 10, 'Incrível! Superou minhas expectativas.'), (11, 111, 2, '2024-03-01', 11, 'Não entendi nada da história.'), (12, 112, 4, '2024-03-05', 12, 'Divertido, mas nada inovador.'),
                                                                                     (13, 113, 5, '2024-03-10', 13, 'Um clássico instantâneo!'), (14, 114, 3, '2024-03-15', 14, 'Atuações medianas.'), (15, 115, 4, '2024-03-20', 15, 'Recomendo para quem gosta do gênero.'),
                                                                                     (16, 116, 5, '2024-04-01', 16, 'Terror psicológico de qualidade.'), (17, 117, 5, '2024-04-05', 17, 'Desenho muito bonito, pena que é curto.'), (18, 118, 4, '2024-04-10', 18, 'Profundo e reflexivo.'),
                                                                                     (19, 119, 3, '2024-04-15', 19, 'Mais ou menos, passatempo.'), (20, 120, 2, '2024-04-20', 20, 'Muito longo, deveria ter sido minissérie.'), (21, 121, 5, '2024-05-01', 21, 'Roteiro inteligente.'),
                                                                                     (22, 122, 2, '2024-05-05', 22, 'Cansativo de assistir.'), (23, 123, 5, '2024-05-10', 23, 'Amo esse filme!'), (24, 124, 3, '2024-05-15', 24, 'Cheio de furos na trama.'), (25, 125, 5, '2024-05-20', 25, 'Uma linda história de amor.'),
                                                                                     (26, 126, 5, '2024-06-01', 26, 'Muita ação, adorei!'), (27, 127, 5, '2024-06-05', 27, 'Me deu medo de verdade.'), (28, 128, 4, '2024-06-10', 28, 'Engraçado e descontraído.'), (29, 129, 4, '2024-06-15', 29, 'Vale a pena a maratona.'), (30, 130, 3, '2024-06-20', 30, 'Poderia ter um final diferente.');

-- Tabela dirige
INSERT INTO dirige (fk_obra_COD) VALUES
                                     (101), (102), (103), (104), (105), (106), (107), (108), (109), (110),
                                     (111), (112), (113), (114), (115), (116), (117), (118), (119), (120),
                                     (121), (122), (123), (124), (125), (126), (127), (128), (129), (130);

-- Tabela assiste
INSERT INTO assiste (fk_conta_cod, fk_obra_COD) VALUES
                                                    (1, 101), (2, 102), (3, 103), (4, 104), (5, 105),
                                                    (6, 106), (7, 107), (8, 108), (9, 109), (10, 110),
                                                    (11, 111), (12, 112), (13, 113), (14, 114), (15, 115),
                                                    (16, 116), (17, 117), (18, 118), (19, 119), (20, 120),
                                                    (21, 121), (22, 122), (23, 123), (24, 124), (25, 125),
                                                    (26, 126), (27, 127), (28, 128), (29, 129), (30, 130);

-- Tabela Assinatura_Assina (Requer fk_Usuario_ID e fk_Plano_tipoPlano. Assumindo ID do Usuario de 1 a 30)
INSERT INTO Assinatura_Assina (fk_Usuario_ID, fk_Plano_tipoPlano) VALUES
                                                                      (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8), (9, 9), (10, 10),
                                                                      (11, 11), (12, 12), (13, 13), (14, 14), (15, 15), (16, 16), (17, 17), (18, 18), (19, 19), (20, 20),
                                                                      (21, 21), (22, 22), (23, 23), (24, 24), (25, 25), (26, 26), (27, 27), (28, 28), (29, 29), (30, 30);

-- Tabela reclamacoes (Requer fk_usuario_ID. Assumindo ID do Usuario de 1 a 30)
