
CREATE DATABASE IF NOT EXISTS StreamingAtualizado2;
USE StreamingAtualizado2;

CREATE TABLE genero (
                        genero_PK INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                        nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE diretor (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         nome VARCHAR(100) NOT NULL,
                         data_nascimento DATE,
                         nacionalidade VARCHAR(50)
);

CREATE TABLE plano (
                       tipo_do_plano VARCHAR(50) PRIMARY KEY,
                       preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
                       qnt_de_telas_simultaneas INT NOT NULL CHECK (qnt_de_telas_simultaneas > 0),
                       possui_anuncio BOOLEAN
);

CREATE TABLE reclamacoes (
                             reclamacao_PK INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                             descricao VARCHAR(255) NOT NULL
);

CREATE TABLE usuario (
                         usuario_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                         nome VARCHAR(100) NOT NULL,
                         email VARCHAR(100) NOT NULL UNIQUE,
                         senha VARCHAR(255) NOT NULL,
                         rua VARCHAR(100),
                         bairro VARCHAR(50),
                         numero INT CHECK (numero > 0)
);

CREATE TABLE obra (
                      codigo INT PRIMARY KEY AUTO_INCREMENT,
                      fk_genero_genero_PK INT,
                      nome VARCHAR(100) NOT NULL,
                      sinopse VARCHAR(500),
                      data_lancamento DATE,
                      qnt_temporadas INT,
                      duracao TIME,
                      fk_diretor_id INT,
                      obra_TIPO INT,
                      FOREIGN KEY (fk_genero_genero_PK) REFERENCES genero(genero_PK),
                      FOREIGN KEY (fk_diretor_id) REFERENCES diretor(id)
);

CREATE TABLE episodio (
                          episodio_id INT PRIMARY KEY AUTO_INCREMENT,
                          numero INT NOT NULL,
                          numero_temporada INT NOT NULL,
                          duracao TIME,
                          fk_obra_codigo INT NOT NULL,
                          FOREIGN KEY (fk_obra_codigo) REFERENCES obra(codigo) ON DELETE CASCADE
);

CREATE TABLE conta (
                       codigo INT PRIMARY KEY AUTO_INCREMENT,
                       data_expiracao DATE,
                       icone VARCHAR(100),
                       status_assinatura VARCHAR(50),
                       fk_usuario_id INT UNIQUE,
                       fk_administrador_id INT,
                       FOREIGN KEY (fk_usuario_id) REFERENCES usuario(usuario_id),
                       FOREIGN KEY (fk_administrador_id) REFERENCES conta(codigo)
);

CREATE TABLE assinatura_assina (
                                   fk_usuario_id INT NOT NULL,
                                   fk_plano_tipo_do_plano VARCHAR(50) NOT NULL,
                                   PRIMARY KEY (fk_usuario_id, fk_plano_tipo_do_plano),
                                   FOREIGN KEY (fk_usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE,
                                   FOREIGN KEY (fk_plano_tipo_do_plano) REFERENCES plano(tipo_do_plano) ON DELETE RESTRICT
);

CREATE TABLE assiste (
                         fk_conta_cod INT NOT NULL,
                         fk_obra_codigo INT NOT NULL,
                         PRIMARY KEY (fk_conta_cod, fk_obra_codigo),
                         FOREIGN KEY (fk_conta_cod) REFERENCES conta(codigo) ON DELETE CASCADE,
                         FOREIGN KEY (fk_obra_codigo) REFERENCES obra(codigo) ON DELETE CASCADE
);

CREATE TABLE avaliacao (
                           fk_conta_cod INT NOT NULL,
                           fk_obra_codigo INT NOT NULL,
                           nota INT DEFAULT 0 CHECK (nota BETWEEN 1 AND 5),
                           data_avaliacao DATE,
                           texto VARCHAR(500),
                           PRIMARY KEY (fk_conta_cod, fk_obra_codigo),
                           FOREIGN KEY (fk_conta_cod) REFERENCES conta(codigo) ON DELETE CASCADE,
                           FOREIGN KEY (fk_obra_codigo) REFERENCES obra(codigo) ON DELETE CASCADE
);

CREATE TABLE comentario (
                            codigo INT PRIMARY KEY AUTO_INCREMENT,
                            fk_conta_cod INT NOT NULL,
                            fk_obra_codigo INT NOT NULL,
                            texto VARCHAR(500),
                            gostei BOOLEAN,
                            FOREIGN KEY (fk_conta_cod) REFERENCES conta(codigo) ON DELETE CASCADE,
                            FOREIGN KEY (fk_obra_codigo) REFERENCES obra(codigo) ON DELETE CASCADE
);

CREATE TABLE historico_de_visualizacao (
                                           fk_conta_cod INT NOT NULL,
                                           fk_obra_codigo INT NOT NULL,
                                           tempo_assistido DECIMAL(10,2) CHECK (tempo_assistido >= 0),
                                           progresso_percentual DECIMAL(5,2) CHECK (progresso_percentual BETWEEN 0 AND 100),
                                           PRIMARY KEY (fk_conta_cod, fk_obra_codigo),
                                           FOREIGN KEY (fk_conta_cod) REFERENCES conta(codigo) ON DELETE CASCADE,
                                           FOREIGN KEY (fk_obra_codigo) REFERENCES obra(codigo) ON DELETE CASCADE
);

CREATE TABLE lista_de_favoritos (
                                    fk_conta_cod INT NOT NULL,
                                    fk_obra_codigo INT NOT NULL,
                                    ordem_de_exibicao INT,
                                    PRIMARY KEY (fk_conta_cod, fk_obra_codigo),
                                    FOREIGN KEY (fk_conta_cod) REFERENCES conta(codigo) ON DELETE CASCADE,
                                    FOREIGN KEY (fk_obra_codigo) REFERENCES obra(codigo) ON DELETE CASCADE
);

CREATE TABLE reclama (
                         fk_usuario_id INT NOT NULL,
                         fk_reclamacao_pk INT NOT NULL,
                         PRIMARY KEY (fk_usuario_id, fk_reclamacao_pk),
                         FOREIGN KEY (fk_usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE,
                         FOREIGN KEY (fk_reclamacao_pk) REFERENCES reclamacoes(reclamacao_PK) ON DELETE CASCADE
);

CREATE TABLE pesquisa_streaming (
                                    id_resposta INT PRIMARY KEY AUTO_INCREMENT,
                                    fk_usuario_id INT,
                                    email VARCHAR(255),
                                    horas_semanais VARCHAR(50),
                                    frequencia_uso VARCHAR(50),
                                    servicos_utilizados TEXT,
                                    dispositivos_utilizados TEXT,
                                    satisfacao_geral INT CHECK (satisfacao_geral BETWEEN 1 AND 5),
                                    satisfacao_recomendacao INT CHECK (satisfacao_recomendacao BETWEEN 1 AND 5),
                                    motivo_insatisfacao TEXT,
                                    genero VARCHAR(50),
                                    faixa_etaria VARCHAR(50),
                                    ocupacao VARCHAR(100),
                                    regiao_residencia VARCHAR(100),
                                    qtd_assinaturas VARCHAR(20),
                                    generos_assistidos TEXT,
                                    preco_ideal_menos VARCHAR(50),
                                    FOREIGN KEY (fk_usuario_id) REFERENCES usuario(usuario_id)
);

INSERT INTO genero (nome) VALUES
                              ('Ação'), ('Comédia'), ('Drama'), ('Ficção Científica'), ('Terror'),
                              ('Suspense'), ('Romance'), ('Documentário'), ('Animação'), ('Aventura'),
                              ('Fantasia'), ('Musical'), ('Mistério'), ('Policial'), ('Guerra'),
                              ('Faroeste'), ('Biografia'), ('Histórico'), ('Esporte'), ('Família'),
                              ('Independente'), ('Cult'), ('Noir'), ('Thriller Psicológico'), ('Super-herói'),
                              ('Anime'), ('Sitcom'), ('Stand-up'), ('Realidade'), ('Variedades');

INSERT INTO reclamacoes (descricao) VALUES
                                        ('Problema de login'), ('Legendas dessincronizadas'), ('Vídeo não carrega'), ('Cobrança indevida'), ('Qualidade de vídeo ruim'),
                                        ('App travando'), ('Dificuldade de cancelamento'), ('Áudio com problema'), ('Conteúdo indisponível na região'), ('Propaganda enganosa'),
                                        ('Interface confusa'), ('Busca não funciona'), ('Erro ao baixar conteúdo'), ('Conta hackeada'), ('Conteúdo removido'),
                                        ('Falta de opção de áudio'), ('Suporte ao cliente ruim'), ('Erro de reprodução'), ('Falta de acessibilidade'), ('Problemas no app da TV'),
                                        ('Lentidão na navegação'), ('Perfil infantil inadequado'), ('Sugestão de conteúdo'), ('Problema com forma de pagamento'), ('Outros'),
                                        ('Não consigo avaliar o conteúdo'), ('A lista de favoritos sumiu'), ('Histórico não atualiza'), ('Legendas com erros de tradução'), ('O aplicativo fechou sozinho');

INSERT INTO plano (tipo_do_plano, preco, qnt_de_telas_simultaneas, possui_anuncio) VALUES
                                                                                       ('Básico com Anúncios', 25.90, 2, TRUE),
                                                                                       ('Padrão', 39.90, 2, FALSE),
                                                                                       ('Premium HD', 55.90, 4, FALSE),
                                                                                       ('Família 4K', 70.00, 6, FALSE);

INSERT INTO diretor (nome, data_nascimento, nacionalidade) VALUES
                                                               ('Fernando Meirelles', '1955-11-09', 'Brasileiro'), ('Glauber Rocha', '1939-03-14', 'Brasileiro'), ('Walter Salles', '1956-04-12', 'Brasileiro'),
                                                               ('José Padilha', '1967-08-01', 'Brasileiro'), ('Anna Muylaert', '1964-04-21', 'Brasileira'), ('Kleber Mendonça Filho', '1968-11-22', 'Brasileiro'),
                                                               ('Hector Babenco', '1946-02-07', 'Argentino-Brasileiro'), ('Bruno Barreto', '1955-03-16', 'Brasileiro'), ('Laís Bodanzky', '1969-09-23', 'Brasileira'),
                                                               ('Carlos Saldanha', '1965-01-24', 'Brasileiro'), ('Quentin Tarantino', '1963-03-27', 'Americano'), ('Martin Scorsese', '1942-11-17', 'Americano'),
                                                               ('Christopher Nolan', '1970-07-30', 'Britânico'), ('Steven Spielberg', '1946-12-18', 'Americano'), ('Bong Joon-ho', '1969-09-14', 'Sul-coreano'),
                                                               ('Guillermo del Toro', '1964-10-09', 'Mexicano'), ('Sofia Coppola', '1971-05-14', 'Americana'), ('Greta Gerwig', '1983-08-04', 'Americana'),
                                                               ('Denis Villeneuve', '1967-10-03', 'Canadense'), ('Alfonso Cuarón', '1961-11-28', 'Mexicano'),
                                                               ('James Cameron', '1954-08-16', 'Canadense'), ('Ridley Scott', '1937-11-30', 'Britânico'), ('David Fincher', '1962-08-28', 'Americano'),
                                                               ('Hayao Miyazaki', '1941-01-05', 'Japonês'), ('Pedro Almodóvar', '1949-09-25', 'Espanhol'), ('Spike Lee', '1957-03-20', 'Americano'),
                                                               ('Wes Anderson', '1969-05-01', 'Americano'), ('Jordan Peele', '1979-02-21', 'Americano'), ('Lulu Wang', '1983-02-25', 'Chinesa-Americana'),
                                                               ('Chloé Zhao', '1982-03-31', 'Chinesa');

INSERT INTO usuario (nome, email, senha, rua, bairro, numero) VALUES
                                                                  ('Ana Silva', 'ana.silva@email.com', 'senha123', 'Rua das Flores', 'Centro', 10),
                                                                  ('Bruno Costa', 'bruno.costa@email.com', 'costa321', 'Avenida Principal', 'Jardins', 25),
                                                                  ('Carla Dias', 'carla.dias@email.com', 'dias123', 'Rua da Praia', 'Copacabana', 150),
                                                                  ('Daniel Faria', 'daniel.faria@email.com', 'faria456', 'Rua das Palmeiras', 'Tijuca', 33),
                                                                  ('Eduarda Lima', 'eduarda.lima@email.com', 'lima789', 'Avenida Brasil', 'Moema', 1200),
                                                                  ('Fábio Melo', 'fabio.melo@email.com', 'melo123', 'Rua Augusta', 'Consolação', 900),
                                                                  ('Gabriela Nunes', 'gabriela.nunes@email.com', 'nunes456', 'Rua do Sol', 'Boa Viagem', 455),
                                                                  ('Heitor Almeida', 'heitor.almeida@email.com', 'almeida789', 'Avenida Paulista', 'Bela Vista', 1800),
                                                                  ('Isabela Barros', 'isabela.barros@email.com', 'barros123', 'Rua dos Pinheiros', 'Pinheiros', 750),
                                                                  ('João Pereira', 'joao.pereira@email.com', 'pereira456', 'Rua da Lapa', 'Lapa', 210),
                                                                  ('Karina Rocha', 'karina.rocha@email.com', 'rocha789', 'Avenida Ipiranga', 'República', 500),
                                                                  ('Lucas Martins', 'lucas.martins@email.com', 'martins123', 'Rua Frei Caneca', 'Cerqueira César', 130),
                                                                  ('Mariana Gomes', 'mariana.gomes@email.com', 'gomes456', 'Rua Sete de Setembro', 'Centro', 180),
                                                                  ('Nelson Oliveira', 'nelson.oliveira@email.com', 'oliveira789', 'Avenida Rio Branco', 'Centro', 99),
                                                                  ('Otávio Souza', 'otavio.souza@email.com', 'souza123', 'Rua da Alfândega', 'Saúde', 250),
                                                                  ('Paula Fernandes', 'paula.fernandes@email.com', 'fernandes456', 'Rua Visconde de Pirajá', 'Ipanema', 340),
                                                                  ('Quintino Borges', 'quintino.borges@email.com', 'borges789', 'Avenida Atlântica', 'Leme', 700),
                                                                  ('Renata Azevedo', 'renata.azevedo@email.com', 'azevedo123', 'Rua Haddock Lobo', 'Jardim Paulista', 1100),
                                                                  ('Sérgio Castro', 'sergio.castro@email.com', 'castro456', 'Rua Oscar Freire', 'Jardins', 555),
                                                                  ('Tatiana Ribeiro', 'tatiana.ribeiro@email.com', 'ribeiro789', 'Alameda Santos', 'Paraíso', 2000),
                                                                  ('Ulisses Neves', 'ulisses.neves@email.com', 'neves123', 'Rua da Quitanda', 'Centro', 80),
                                                                  ('Vanessa Ramos', 'vanessa.ramos@email.com', 'ramos456', 'Rua Barão de Itapetininga', 'Vila Buarque', 120),
                                                                  ('William Santos', 'william.santos@email.com', 'santos789', 'Avenida Angélica', 'Higienópolis', 1500),
                                                                  ('Xavier Pinto', 'xavier.pinto@email.com', 'pinto123', 'Rua Maria Antônia', 'Consolação', 294),
                                                                  ('Yara Mendonça', 'yara.mendonca@email.com', 'mendonca456', 'Avenida Higienópolis', 'Higienópolis', 618),
                                                                  ('Zélia Cardoso', 'zelia.cardoso@email.com', 'cardoso789', 'Rua da Consolação', 'Jardins', 222),
                                                                  ('André Barbosa', 'andre.barbosa@email.com', 'barbosa123', 'Rua Itambé', 'Higienópolis', 45),
                                                                  ('Beatriz Tavares', 'beatriz.tavares@email.com', 'tavares456', 'Avenida Nove de Julho', 'Jardim Paulista', 3000),
                                                                  ('Caio Drummond', 'caio.drummond@email.com', 'drummond789', 'Rua Pamplona', 'Jardim Paulista', 800),
                                                                  ('Débora Freire', 'debora.freire@email.com', 'freire123', 'Rua Bela Cintra', 'Cerqueira César', 1700);

INSERT INTO reclama (fk_usuario_id, fk_reclamacao_pk) VALUES
                                                          (1, 1), (2, 3), (3, 4), (4, 2), (5, 5), (6, 8), (7, 6), (8, 11), (9, 9), (10, 14),
                                                          (11, 1), (12, 3), (13, 7), (14, 12), (15, 15), (16, 18), (17, 20), (18, 10), (19, 22), (20, 13),
                                                          (21, 25), (22, 1), (23, 3), (24, 4), (25, 16), (26, 19), (27, 21), (28, 24), (29, 2), (30, 5),
                                                          (1, 26), (1, 27), (2, 26), (3, 27), (4, 28);

INSERT INTO obra (nome, sinopse, fk_genero_genero_PK, data_lancamento, qnt_temporadas, duracao, fk_diretor_id, obra_TIPO) VALUES
                                                                                                                              ('Cidade de Deus', 'A vida na favela sob a ótica do crime, da amizade e da vingança.', 14, '2002-08-30', NULL, '02:10:00', 1, 1),
                                                                                                                              ('Tropa de Elite', 'A rotina de um capitão do BOPE que busca um substituto enquanto lida com a pressão do trabalho e da família.', 1, '2007-10-05', NULL, '01:55:00', 4, 1),
                                                                                                                              ('O Auto da Compadecida', 'As aventuras de João Grilo e Chicó, dois nordestinos pobres que vivem de golpes para sobreviver.', 2, '2000-09-15', NULL, '01:44:00', 25, 1),
                                                                                                                              ('Bacurau', 'Após a morte da matriarca, uma cidade do sertão brasileiro some misteriosamente do mapa.', 6, '2019-08-29', NULL, '02:11:00', 6, 1),
                                                                                                                              ('3%', 'Em um futuro distópico, jovens competem em um processo seletivo brutal por uma chance de viver em um paraíso.', 4, '2016-11-25', 4, '00:49:00', NULL, 2),
                                                                                                                              ('Coisa Mais Linda', 'Uma mulher forte abre um clube de bossa nova no Rio de Janeiro dos anos 50, desafiando a sociedade.', 3, '2019-03-22', 2, '00:52:00', NULL, 2),
                                                                                                                              ('A Origem', 'Um ladrão de sonhos enfrenta seu último e mais desafiador trabalho: implantar uma ideia na mente de alguém.', 4, '2010-08-06', NULL, '02:28:00', 13, 1),
                                                                                                                              ('Parasita', 'Uma família pobre se infiltra de forma engenhosa na vida de uma família rica, com consequências inesperadas.', 6, '2019-11-07', NULL, '02:12:00', 15, 1),
                                                                                                                              ('A Viagem de Chihiro', 'Uma menina de 10 anos se perde em um mundo mágico e misterioso habitado por deuses e monstros.', 9, '2003-07-18', NULL, '02:05:00', 24, 1),
                                                                                                                              ('The Office', 'Documentário cômico sobre o dia a dia de funcionários excêntricos em um escritório de uma empresa de papel.', 27, '2005-03-24', 9, '00:22:00', NULL, 2),
                                                                                                                              ('Breaking Bad', 'Um professor de química com câncer terminal começa a produzir metanfetamina para garantir o futuro de sua família.', 3, '2008-01-20', 5, '00:47:00', NULL, 2),
                                                                                                                              ('O Poderoso Chefão', 'A saga de uma família mafiosa italiana em Nova York e a ascensão de Michael Corleone ao poder.', 14, '1972-09-08', NULL, '02:55:00', 11, 1),
                                                                                                                              ('Matrix', 'Um hacker descobre que sua realidade é uma simulação e se junta a uma rebelião contra as máquinas.', 4, '1999-05-21', NULL, '02:16:00', NULL, 1),
                                                                                                                              ('Forrest Gump', 'A história da vida de um homem simples com um QI baixo, mas boas intenções, que testemunha eventos históricos.', 7, '1994-12-07', NULL, '02:22:00', 14, 1),
                                                                                                                              ('Game of Thrones', 'Famílias nobres de Westeros disputam o Trono de Ferro em uma trama de política, guerra e fantasia.', 11, '2011-04-17', 8, '00:55:00', NULL, 2),
                                                                                                                              ('Interestelar', 'Em um futuro onde a Terra está morrendo, uma equipe de astronautas viaja por um buraco de minhoca em busca de um novo lar.', 4, '2014-11-06', NULL, '02:49:00', 13, 1),
                                                                                                                              ('Fleabag', 'A vida de uma jovem de luto e com humor ácido em Londres.', 2, '2016-07-21', 2, '00:27:00', NULL, 2),
                                                                                                                              ('Chernobyl', 'Minissérie que dramatiza a história do desastre nuclear de 1986.', 18, '2019-05-06', 1, '01:05:00', NULL, 2),
                                                                                                                              ('O Silêncio dos Inocentes', 'Uma agente do FBI busca a ajuda de um brilhante assassino para capturar outro serial killer.', 24, '1991-05-31', NULL, '01:58:00', 22, 1),
                                                                                                                              ('Clube da Luta', 'Um homem insone e um vendedor de sabão criam um clube de luta clandestino.', 21, '1999-10-29', NULL, '02:19:00', 23, 1),
                                                                                                                              ('Pulp Fiction', 'As vidas de dois assassinos de aluguel e outros personagens se entrelaçam.', 14, '1994-10-14', NULL, '02:34:00', 11, 1),
                                                                                                                              ('Vingadores: Ultimato', 'Os heróis restantes da Marvel se unem para uma última cartada contra Thanos.', 25, '2019-04-25', NULL, '03:01:00', 21, 1),
                                                                                                                              ('Coringa', 'Em Gotham, um comediante fracassado busca conexão enquanto a cidade mergulha no caos.', 3, '2019-10-03', NULL, '02:02:00', NULL, 1),
                                                                                                                              ('Stranger Things', 'Um grupo de crianças em uma cidade pequena nos anos 80 descobre mistérios sobrenaturais.', 5, '2016-07-15', 4, '00:51:00', NULL, 2),
                                                                                                                              ('A Casa de Papel', 'Um grupo de assaltantes executa um plano ambicioso para roubar a Casa da Moeda da Espanha.', 6, '2017-05-02', 5, '00:45:00', NULL, 2),
                                                                                                                              ('Sintonia', 'A história de três jovens da periferia de São Paulo que lutam para realizar seus sonhos.', 3, '2019-08-09', 3, '00:40:00', NULL, 2),
                                                                                                                              ('Bom Dia, Verônica', 'Uma escrivã da polícia investiga por conta própria dois casos arquivados.', 14, '2020-10-01', 2, '00:48:00', NULL, 2),
                                                                                                                              ('O Menino e o Mundo', 'Um garoto sai em busca de seu pai em uma aventura que retrata os problemas do mundo moderno.', 9, '2014-01-17', NULL, '01:20:00', 10, 1),
                                                                                                                              ('Que Horas Ela Volta?', 'A chegada da filha da empregada doméstica na casa dos patrões abala a estrutura social.', 3, '2015-08-27', NULL, '01:52:00', 5, 1),
                                                                                                                              ('O Irlandês', 'A vida de um assassino de aluguel da máfia e seu envolvimento no desaparecimento de Jimmy Hoffa.', 17, '2019-11-27', NULL, '03:29:00', 12, 1);

INSERT INTO episodio (fk_obra_codigo, numero_temporada, numero, duracao) VALUES
                                                                             (5, 1, 1, '00:48:00'), (5, 1, 2, '00:51:00'), (5, 2, 1, '00:49:00'),
                                                                             (6, 1, 1, '00:53:00'), (6, 1, 2, '00:50:00'), (6, 2, 1, '00:55:00'),
                                                                             (10, 1, 1, '00:21:00'), (10, 1, 2, '00:23:00'), (10, 2, 1, '00:22:00'),
                                                                             (11, 1, 1, '00:47:00'), (11, 1, 2, '00:48:00'), (11, 2, 1, '00:46:00'),
                                                                             (15, 1, 1, '00:58:00'), (15, 1, 2, '00:56:00'), (15, 2, 1, '00:59:00'),
                                                                             (17, 1, 1, '00:26:00'), (17, 1, 2, '00:28:00'), (17, 2, 1, '00:25:00'),
                                                                             (18, 1, 1, '01:03:00'), (18, 1, 2, '01:08:00'),
                                                                             (24, 1, 1, '00:50:00'), (24, 1, 2, '00:52:00'), (24, 2, 1, '00:51:00'),
                                                                             (25, 1, 1, '00:44:00'), (25, 1, 2, '00:46:00'), (25, 2, 1, '00:43:00'),
                                                                             (26, 1, 1, '00:41:00'), (26, 1, 2, '00:39:00'),
                                                                             (27, 1, 1, '00:47:00'), (27, 1, 2, '00:49:00');

INSERT INTO conta (data_expiracao, icone, status_assinatura, fk_usuario_id, fk_administrador_id) VALUES
                                                                                                     ('2026-10-20', 'avatar01.png', 'Ativa', 1, NULL),
                                                                                                     ('2025-11-15', 'avatar02.png', 'Ativa', 2, 1),
                                                                                                     ('2025-09-22', 'avatar03.png', 'Cancelada', 3, 1),
                                                                                                     ('2026-05-30', 'avatar04.png', 'Ativa', 4, 1),
                                                                                                     ('2027-01-10', 'avatar05.png', 'Ativa', 5, 4),
                                                                                                     ('2025-12-01', 'avatar06.png', 'Pendente', 6, 4),
                                                                                                     ('2026-08-18', 'avatar07.png', 'Ativa', 7, NULL),
                                                                                                     ('2025-10-05', 'avatar08.png', 'Ativa', 8, 7),
                                                                                                     ('2024-03-12', 'avatar09.png', 'Expirada', 9, 7),
                                                                                                     ('2026-11-25', 'avatar10.png', 'Ativa', 10, 9),
                                                                                                     ('2027-02-14', 'avatar11.png', 'Ativa', 11, 9),
                                                                                                     ('2026-09-09', 'avatar12.png', 'Ativa', 12, 9),
                                                                                                     ('2025-04-04', 'avatar13.png', 'Cancelada', 13, 11),
                                                                                                     ('2026-06-07', 'avatar14.png', 'Ativa', 14, 13),
                                                                                                     ('2026-07-19', 'avatar15.png', 'Ativa', 15, 14),
                                                                                                     ('2025-08-30', 'avatar16.png', 'Pendente', 16, 15),
                                                                                                     ('2026-12-21', 'avatar17.png', 'Ativa', 17, 15),
                                                                                                     ('2027-03-01', 'avatar18.png', 'Ativa', 18, 16),
                                                                                                     ('2023-11-11', 'avatar19.png', 'Expirada', 19, 17),
                                                                                                     ('2026-02-28', 'avatar20.png', 'Ativa', 20, 18),
                                                                                                     ('2026-04-15', 'avatar21.png', 'Ativa', 21, 20),
                                                                                                     ('2025-10-10', 'avatar22.png', 'Ativa', 22, 20),
                                                                                                     ('2025-06-13', 'avatar23.png', 'Cancelada', 23, 20),
                                                                                                     ('2026-10-17', 'avatar24.png', 'Ativa', 24, 20),
                                                                                                     ('2027-05-20', 'avatar25.png', 'Ativa', 25, 20),
                                                                                                     ('2025-11-02', 'avatar26.png', 'Pendente', 26, 25),
                                                                                                     ('2026-03-25', 'avatar27.png', 'Ativa', 27, 25),
                                                                                                     ('2025-09-30', 'avatar28.png', 'Ativa', 28, NULL),
                                                                                                     ('2024-08-08', 'avatar29.png', 'Expirada', 29, 28),
                                                                                                     ('2027-06-01', 'avatar30.png', 'Ativa', 30, 28);

INSERT INTO assinatura_assina (fk_usuario_id, fk_plano_tipo_do_plano) VALUES
                                                                          (1, 'Premium HD'),
                                                                          (2, 'Padrão'),
                                                                          (3, 'Básico com Anúncios'),
                                                                          (4, 'Família 4K'),
                                                                          (5, 'Premium HD'),
                                                                          (6, 'Padrão'),
                                                                          (7, 'Padrão'),
                                                                          (8, 'Básico com Anúncios'),
                                                                          (9, 'Premium HD'),
                                                                          (10, 'Família 4K'),
                                                                          (11, 'Padrão'),
                                                                          (12, 'Básico com Anúncios'),
                                                                          (13, 'Premium HD'),
                                                                          (14, 'Padrão'),
                                                                          (15, 'Padrão'),
                                                                          (16, 'Família 4K'),
                                                                          (17, 'Premium HD'),
                                                                          (18, 'Básico com Anúncios'),
                                                                          (19, 'Padrão'),
                                                                          (20, 'Premium HD'),
                                                                          (21, 'Básico com Anúncios'),
                                                                          (22, 'Padrão'),
                                                                          (23, 'Premium HD'),
                                                                          (24, 'Família 4K'),
                                                                          (25, 'Básico com Anúncios'),
                                                                          (26, 'Padrão'),
                                                                          (27, 'Premium HD'),
                                                                          (28, 'Padrão'),
                                                                          (29, 'Básico com Anúncios'),
                                                                          (30, 'Família 4K');

INSERT INTO assiste (fk_conta_cod, fk_obra_codigo) VALUES
                                                       (1, 1), (1, 5), (2, 2), (3, 7), (4, 11), (5, 15), (6, 24), (7, 8), (8, 25), (9, 1),
                                                       (10, 10), (11, 16), (12, 20), (13, 21), (14, 4), (15, 6), (16, 18), (17, 22), (18, 3), (19, 12),
                                                       (20, 13), (21, 17), (22, 26), (23, 29), (24, 30), (25, 9), (26, 27), (27, 11), (28, 24), (29, 1);

INSERT INTO avaliacao (fk_conta_cod, fk_obra_codigo, nota, data_avaliacao, texto) VALUES
                                                                                      (1, 1, 5, '2025-09-10', 'Excelente!'), (2, 2, 4, '2025-09-11', 'Muito bom, recomendo.'), (3, 7, 3, '2025-09-12', 'Razoável, esperava mais.'),
                                                                                      (4, 11, 5, '2025-09-13', 'Perfeito, um dos melhores que já vi.'), (5, 15, 2, '2025-09-14', 'Não gostei, enredo fraco.'),
                                                                                      (6, 24, 4, '2025-09-15', 'Ótima atuação.'), (7, 8, 1, '2025-09-16', 'Péssimo, perdi meu tempo.'), (8, 25, 5, '2025-09-17', 'Fotografia impecável.'),
                                                                                      (9, 1, 3, '2025-09-18', 'Começa bem, mas se perde no final.'), (10, 10, 4, '2025-09-19', 'Divertido.'),
                                                                                      (11, 16, 5, '2025-08-01', 'Obra de arte!'), (12, 20, 4, '2025-08-02', 'Surpreendente.'), (13, 21, 3, '2025-08-03', 'Ok.'),
                                                                                      (14, 4, 5, '2025-08-04', 'Inesquecível.'), (15, 6, 2, '2025-08-05', 'Decepcionante.'), (16, 18, 4, '2025-08-06', 'Vale a pena assistir.'),
                                                                                      (17, 22, 1, '2025-08-07', 'Muito ruim.'), (18, 3, 5, '2025-08-08', 'Fantástico!'), (19, 12, 3, '2025-08-09', 'Mediano.'),
                                                                                      (20, 13, 4, '2025-08-10', 'Inteligente.'), (21, 17, 5, '2025-07-20', 'Maravilhoso.'), (22, 26, 4, '2025-07-21', 'Prende a atenção.'),
                                                                                      (23, 29, 3, '2025-07-22', 'Poderia ser melhor.'), (24, 30, 5, '2025-07-23', 'Genial.'), (25, 9, 2, '2025-07-24', 'Chato.'),
                                                                                      (26, 27, 4, '2025-07-25', 'Emocionante.'), (27, 11, 1, '2025-07-26', 'Terrível.'), (28, 24, 5, '2025-07-27', 'Espetacular.'),
                                                                                      (29, 1, 3, '2025-07-28', 'Regular.'), (30, 5, 4, '2025-07-29', 'Muito bem feito.');

INSERT INTO comentario (fk_conta_cod, fk_obra_codigo, texto, gostei) VALUES
                                                                         (1, 1, 'Adorei o final!', TRUE), (2, 2, 'O protagonista é irritante.', FALSE), (3, 7, 'Que plot twist!', TRUE),
                                                                         (4, 11, 'A trilha sonora é incrível.', TRUE), (5, 15, 'Achei o ritmo muito lento.', FALSE), (6, 24, 'Me fez chorar.', TRUE),
                                                                         (7, 8, 'Não entendi nada.', FALSE), (8, 25, 'Maratonei em um dia!', TRUE), (9, 1, 'Cenas de ação bem coreografadas.', TRUE),
                                                                         (10, 10, 'Personagens sem profundidade.', FALSE), (11, 16, 'Figurino impecável.', TRUE), (12, 20, 'O humor é muito forçado.', FALSE),
                                                                         (13, 21, 'Reassistindo pela terceira vez.', TRUE), (14, 4, 'O livro é bem melhor.', FALSE), (15, 6, 'Me identifiquei com a história.', TRUE),
                                                                         (16, 18, 'Ansioso pela próxima temporada.', TRUE), (17, 22, 'Cancelaram a série, que ódio.', FALSE), (18, 3, 'Atuação de gala.', TRUE),
                                                                         (19, 12, 'Efeitos especiais deixaram a desejar.', FALSE), (20, 13, 'Um clássico moderno.', TRUE), (21, 17, 'Superestimado.', FALSE),
                                                                         (22, 26, 'Me surpreendeu positivamente.', TRUE), (23, 29, 'O vilão rouba a cena.', TRUE), (24, 30, 'Merecia mais reconhecimento.', TRUE),
                                                                         (25, 9, 'Final decepcionante.', FALSE), (26, 27, 'Para assistir com a família.', TRUE), (27, 11, 'Muito pesado.', FALSE),
                                                                         (28, 24, 'Direção genial.', TRUE), (29, 1, 'História clichê.', FALSE), (30, 5, 'Recomendo a todos.', TRUE);

INSERT INTO historico_de_visualizacao (fk_conta_cod, fk_obra_codigo, tempo_assistido, progresso_percentual) VALUES
                                                                                                                (1, 1, 7800.50, 99.50), (2, 2, 3200.00, 45.10), (3, 7, 8820.00, 100.00), (4, 11, 1500.75, 25.00), (5, 15, 4500.00, 50.25),
                                                                                                                (6, 24, 9200.00, 100.00), (7, 8, 650.20, 10.80), (8, 25, 2400.00, 33.33), (9, 1, 5600.00, 80.00), (10, 10, 1234.56, 15.70),
                                                                                                                (11, 16, 6800.00, 100.00), (12, 20, 4980.00, 75.00), (13, 21, 300.00, 5.00), (14, 4, 7100.00, 92.40), (15, 6, 10800.00, 100.00),
                                                                                                                (16, 18, 999.00, 12.00), (17, 22, 4250.50, 55.50), (18, 3, 5400.00, 68.90), (19, 12, 8100.00, 99.00), (20, 13, 3300.00, 40.00),
                                                                                                                (21, 17, 5000.00, 100.00), (22, 26, 1800.00, 22.80), (23, 29, 750.00, 9.50), (24, 30, 6320.00, 81.20), (25, 9, 11000.00, 100.00),
                                                                                                                (26, 27, 2040.00, 30.00), (27, 11, 4800.00, 66.70), (28, 24, 3150.80, 45.00), (29, 1, 9500.00, 100.00), (30, 5, 800.00, 8.80);

INSERT INTO lista_de_favoritos (fk_conta_cod, fk_obra_codigo, ordem_de_exibicao) VALUES
                                                                                     (1, 1, 1), (2, 2, 2), (3, 7, 1), (4, 11, 3), (5, 15, 1), (6, 24, 2), (7, 8, 1), (8, 25, 1), (9, 1, 3), (10, 10, 2),
                                                                                     (11, 16, 1), (12, 20, 1), (13, 21, 2), (14, 4, 1), (15, 6, 2), (16, 18, 3), (17, 22, 1), (18, 3, 1), (19, 12, 2), (20, 13, 1),
                                                                                     (21, 17, 3), (22, 26, 2), (23, 29, 1), (24, 30, 1), (25, 9, 2), (26, 27, 1), (27, 11, 3), (28, 24, 1), (29, 1, 2), (30, 5, 1);

INSERT INTO pesquisa_streaming (
    fk_usuario_id,
    email, ocupacao, regiao_residencia, genero, faixa_etaria, qtd_assinaturas,
    servicos_utilizados, motivo_insatisfacao, generos_assistidos, frequencia_uso, horas_semanais,
    satisfacao_geral, satisfacao_recomendacao, dispositivos_utilizados, preco_ideal_menos
) VALUES
      (1, 'manoelcarreiroa@gmail.com', 'Autônomo(a)', 'Região Nordeste', 'Masculino', 'Entre 50 e 70 anos', '2', 'Netflix, Amazon Prime Video', 'Títulos dessinteressantes, Falta de produções originais de qualidade, Limitação de telas, Conteúdo limitado ou repetitivo, Propagandas', 'Ação, Comédia, Drama, Documentário, Romance', 'Semanalmente', 'Até 4 horas', 4, 4, 'TV', 'Entre R$15,00 e R$30,00'),
      (2, 'lsncb.leticia.pessoal@gmail.com', NULL, 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '2', 'Netflix', 'Títulos dessinteressantes, Falta de produções originais de qualidade, Conteúdo limitado ou repetitivo, Preço elevado, Propagandas, pouca variedade e filmes ruins', 'Comédia, Drama, Romance', 'Raramente', '3', NULL, 3, 'TV, Computador/Notebook, Dispositivo de streaming (Ex: Chromecast, Fire TV Stick)', 'Entre R$15,00 e R$30,00'),
      (3, 'segurosmedicosusa@gmail.com', 'Autônomo(a)', 'Estados Unidos', 'Masculino', 'Entre 30 e 50 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Apple TV, Paramount Plus', 'Falta de produções originais de qualidade, Limitação de telas, Conteúdo limitado ou repetitivo', 'Ação, Comédia, Documentário', 'Raramente', 'Raramente', 4, 4, 'TV, Smartphone, Computador/Notebook', 'Acima de R$50,00'),
      (4, 'fafhcavalcanti@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 30 e 50 anos', '2', 'Crunchyroll', 'Títulos dessinteressantes', 'Drama, Ficção Científica, Animação', 'Semanalmente', 'Até 4 horas', 4, 4, 'Computador/Notebook', 'Acima de R$50,00'),
      (5, 'b.cardoso.araujo@gmail.com', 'CLT', 'Região Sul', 'Feminino', 'Entre 18 e 30 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max', 'Conteúdo limitado ou repetitivo, Preço elevado, Propagandas', 'Drama, Documentário, Romance', 'Semanalmente', 'Até 4 horas', 4, 4, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
      (6, 'vdmdf2016@gmail.com', 'Integrante de empresa júnior', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Crunchyroll', 'Títulos dessinteressantes', 'Ação, Comédia, Drama, Animação, Romance', 'Diariamente', 'Até 4 horas', 5, 4, 'Smartphone, Computador/Notebook, Dispositivo de streaming (Ex: Chromecast, Fire TV Stick)', 'Entre R$30,00 e R$50,00'),
      (7, 'ibn@cesar.school', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play, Apple TV, Crunchyroll', 'Títulos dessinteressantes, Preço elevado', 'Ação, Comédia, Ficção Científica, Animação', 'Semanalmente', 'Até 2 horas', 4, 4, 'TV, Smartphone, Computador/Notebook', 'Entre R$15,00 e R$30,00'),
      (8, 'joaopedrodmv21@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+', 'Conteúdo limitado ou repetitivo, Preço elevado, Propagandas', 'Ação, Comédia, Animação, Romance', 'Semanalmente', 'Até 2 horas', 3, 4, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
      (9, 'rft@cesar.school', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, HBO Max, Paramount Plus, Crunchyroll', 'Títulos dessinteressantes, Varia mto de cada uma', 'Comédia, Terror', 'Mensalmente', 'Raramente', 4, 3, 'TV, Tablet', 'Entre R$15,00 e R$30,00'),
      (10, 'gabriel.fcarvalho@upe.br', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '3', 'Netflix, Amazon Prime Video, Apple TV', 'Títulos dessinteressantes, Conteúdo limitado ou repetitivo', 'Comédia, Documentário, Animação', 'Raramente', 'Raramente', 2, 1, 'TV', 'Entre R$15,00 e R$30,00'),
      (11, 'eduardoscavalcantij@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '3', 'Netflix, Amazon Prime Video, Crunchyroll', 'Títulos dessinteressantes, Limitação de telas, Conteúdo limitado ou repetitivo, Preço elevado, Propagandas', 'Comédia, Ficção Científica, Animação', 'Raramente', 'Raramente', 4, 4, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
      (12, 'mcr@cesar.school', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, HBO Max, Paramount Plus, Crunchyroll', 'Títulos dessinteressantes, Preço elevado, Propagandas', 'Ação, Comédia, Ficção Científica, Animação', 'Diariamente', 'Até 2 horas', 3, 3, 'Smartphone, Computador/Notebook', 'Até R$15,00'),
      (13, 'gabrielfribeiro04@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '3', 'Netflix, Amazon Prime Video, HBO Max', 'Títulos dessinteressantes', 'Ação, Drama, Ficção Científica', 'Semanalmente', 'Até 4 horas', 2, 4, 'TV, Computador/Notebook', 'Entre R$15,00 e R$30,00'),
      (14, 'ana.rangels@ufpe.br', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '2', 'Netflix, Amazon Prime Video', 'Títulos dessinteressantes, Falta de atualização, Limitação de telas, Preço elevado, Propagandas', 'Comédia, Drama, Ficção Científica, Terror, Romance', 'Diariamente', 'Até 2 horas', 2, 3, 'TV, Smartphone, Tablet', 'Até R$15,00'),
      (15, 'jfilipej1@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '1', 'Netflix', 'Limitação de telas', 'Ação, Comédia, Documentário', 'Semanalmente', 'Até 2 horas', 4, 4, 'TV, Computador/Notebook', 'Até R$15,00'),
      (16, 'ceciliaeeskinazi@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, HBO Max, Globo play, Apple TV', 'Preço elevado, Propagandas', 'Ficção Científica, Terror, Romance', 'Semanalmente', 'Até 4 horas', 4, 4, 'TV, Computador/Notebook', 'Entre R$15,00 e R$30,00'),
      (17, 'mariajulinhagomes12@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+, HBO Max', 'Falta de produções originais de qualidade, Limitação de telas, Preço elevado, Propagandas', 'Comédia, Romance', 'Mensalmente', 'Até 2 horas', 4, 3, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
      (18, 'gigimaal2019@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Disney+, HBO Max, Globo play, Paramount Plus', 'Títulos dessinteressantes, Falta de atualização, Preço elevado, Propagandas', 'Ação, Comédia, Ficção Científica, Animação, Romance', 'Raramente', 'Raramente', 3, 3, 'Computador/Notebook', 'Entre R$30,00 e R$50,00'),
      (19, 'anamariiaalves05@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play', 'Preço elevado', 'Ação, Drama', 'Diariamente', 'Até 4 horas', 5, 5, 'TV, Smartphone, Tablet', 'Entre R$30,00 e R$50,00'),
      (20, 'estersoutto1@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Disney+, Globo play', 'Títulos dessinteressantes', 'Comédia, Drama, Romance', 'Diariamente', 'Até 4 horas', 3, 3, 'TV, Tablet', 'Entre R$15,00 e R$30,00'),
      (21, 'michelecarla988@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '1', 'Netflix', 'Títulos dessinteressantes', 'Comédia, Terror, Animação, Romance', 'Raramente', 'Raramente', 4, 3, 'TV, Smartphone, Tablet', 'Entre R$15,00 e R$30,00'),
      (22, 'gmdf@cesar.school', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '2', 'Amazon Prime Video, Disney+', 'Preço elevado, Propagandas', 'Ação, Comédia, Animação, Romance', 'Semanalmente', 'Mais que 4 horas', 1, 1, 'TV, Computador/Notebook, Dispositivo de streaming (Ex: Chromecast, Fire TV Stick)', 'Entre R$15,00 e R$30,00'),
      (23, 'mariafernandamalta0006@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '3', 'Netflix, Amazon Prime Video, HBO Max, Globo play', 'Títulos dessinteressantes, Falta de atualização, Preço elevado, Propagandas', 'Ação, Comédia, Romance', 'Semanalmente', 'Até 2 horas', 4, 5, 'Smartphone, Tablet', 'Entre R$15,00 e R$30,00'),
      (24, 'lipe2101@gmail.com', 'Estagiário', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play, Apple TV', 'Títulos dessinteressantes, Falta de atualização, Limitação de telas, Conteúdo limitado ou repetitivo, Preço elevado, Propagandas', 'Ação, Comédia, Documentário', 'Diariamente', 'Mais que 4 horas', 4, 4, 'TV', 'Entre R$15,00 e R$30,00'),
      (25, 'malu.abreu.tenorio@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Amazon Prime Video, Disney+, HBO Max', 'Falta de produções originais de qualidade, Limitação de telas', 'Ação, Comédia, Drama, Romance', 'Diariamente', 'Mais que 4 horas', 3, 2, 'TV, Tablet', 'Entre R$15,00 e R$30,00'),
      (26, 'carolina.argusmao@gmail.com', 'CLT', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play, Apple TV', 'Limitação de telas, Propagandas', 'Ação, Comédia, Romance', 'Semanalmente', 'Mais que 4 horas', 4, 4, 'TV', 'Acima de R$50,00'),
      (27, 'bia.gusmao09@gmail.com', 'Autônomo(a)', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play', 'Títulos dessinteressantes, Falta de atualização, Conteúdo limitado ou repetitivo', 'Ação, Comédia, Drama, Ficção Científica, Documentário, Romance', 'Diariamente', 'Mais que 4 horas', 4, 3, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
      (28, 'andrea.araujo@fundaj.gov.br', 'Servidor público', 'Região Nordeste', 'Feminino', 'Entre 50 e 70 anos', '4 a 5', 'Netflix, Amazon Prime Video, Globo play', NULL, 'Ação, Drama, Documentário, Romance', 'Diariamente', 'Até 4 horas', 4, 4, 'TV', 'Entre R$30,00 e R$50,00'),
      (29, 'robertaaraujogusmao@gmail.com', 'Autônomo(a)', 'Região Nordeste', 'Feminino', 'Entre 50 e 70 anos', '3', 'Netflix, Amazon Prime Video, Globo play', 'Limitação de telas', 'Ação, Drama, Documentário', 'Semanalmente', 'Mais que 4 horas', 4, 4, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
      (30, 'lucasgbcorreia@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play', 'Preço elevado, Propagandas', 'Ação, Comédia, Terror', 'Diariamente', 'Mais que 4 horas', 3, 4, 'TV, Smartphone', 'Entre R$15,00 e R$30,00');