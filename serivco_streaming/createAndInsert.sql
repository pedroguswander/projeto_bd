CREATE DATABASE IF NOT EXISTS Streaming;
USE Streaming;

CREATE TABLE genero (
                        genero_PK INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                        nome VARCHAR(50) NOT NULL
);

CREATE TABLE reclamacoes (
                             reclamacoes_PK INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                             descricao VARCHAR(255) NOT NULL
);

CREATE TABLE usuario (
                         usuario_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                         fk_reclamacoes_reclamacoes_PK INT,
                         rua VARCHAR(100),
                         bairro VARCHAR(50),
                         numero INT CHECK (numero > 0),
                         nome VARCHAR(100) NOT NULL,
                         email VARCHAR(100) NOT NULL UNIQUE,
                         senha VARCHAR(255) NOT NULL,
                         FOREIGN KEY (fk_reclamacoes_reclamacoes_PK)
                             REFERENCES reclamacoes(reclamacoes_PK)
                             ON DELETE SET NULL
);

CREATE TABLE plano (
                       tipo_do_plano VARCHAR(50) PRIMARY KEY,
                       preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
                       qnt_de_telas_simultaneas INT NOT NULL CHECK (qnt_de_telas_simultaneas > 0),
                       possui_anuncio BOOLEAN
);

CREATE TABLE conta (
                       codigo INT PRIMARY KEY AUTO_INCREMENT,
                       data_expiracao DATE,
                       icone VARCHAR(100),
                       status_assinatura VARCHAR(50)
);

CREATE TABLE assinatura_assina (
                                   assinatura_id INT PRIMARY KEY AUTO_INCREMENT,
                                   fk_usuario_id INT NOT NULL,
                                   fk_plano_tipo_do_plano VARCHAR(50) NOT NULL,
                                   FOREIGN KEY (fk_usuario_id) REFERENCES usuario(usuario_id),
                                   FOREIGN KEY (fk_plano_tipo_do_plano) REFERENCES plano(tipo_do_plano)
);

CREATE TABLE obra (
                      codigo INT PRIMARY KEY AUTO_INCREMENT,
                      fk_genero_genero_PK INT,
                      nome VARCHAR(100) NOT NULL,
                      sinopse VARCHAR(500),
                      data_lancamento DATE,
                      qnt_temporadas INT,
                      duracao TIME,
                      obra_TIPO INT,
                      FOREIGN KEY (fk_genero_genero_PK) REFERENCES genero(genero_PK)
);

CREATE TABLE episodio (
                          episodio_id INT PRIMARY KEY AUTO_INCREMENT,
                          numero INT NOT NULL,
                          numero_temporada INT NOT NULL,
                          duracao TIME,
                          fk_obra_codigo INT,
                          FOREIGN KEY (fk_obra_codigo) REFERENCES obra(codigo) ON DELETE CASCADE
);

CREATE TABLE diretor (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         nome VARCHAR(100) NOT NULL,
                         data_nascimento DATE,
                         nacionalidade VARCHAR(50)
);

CREATE TABLE dirige (
                        dirige_id INT PRIMARY KEY AUTO_INCREMENT,
                        fk_diretor_id INT,
                        fk_obra_codigo INT,
                        FOREIGN KEY (fk_diretor_id) REFERENCES diretor(id) ON DELETE RESTRICT,
                        FOREIGN KEY (fk_obra_codigo) REFERENCES obra(codigo) ON DELETE CASCADE
);

CREATE TABLE avaliacao (
                           codigo INT PRIMARY KEY AUTO_INCREMENT,
                           nota INT DEFAULT 0,
                           data_avaliacao DATE,
                           texto VARCHAR(500)
);

CREATE TABLE comentario (
                            codigo INT PRIMARY KEY AUTO_INCREMENT,
                            texto VARCHAR(500),
                            gostei BOOLEAN
);

CREATE TABLE faz_comentario_avaliacao_usuario (
                                                  id INT PRIMARY KEY AUTO_INCREMENT,
                                                  fk_comentario_codigo INT,
                                                  fk_avaliacao_codigo INT,
                                                  fk_usuario_id INT,
                                                  FOREIGN KEY (fk_comentario_codigo) REFERENCES comentario(codigo),
                                                  FOREIGN KEY (fk_avaliacao_codigo) REFERENCES avaliacao(codigo),
                                                  FOREIGN KEY (fk_usuario_id) REFERENCES usuario(usuario_id)
);

CREATE TABLE assiste (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         fk_usuario_id INT,
                         fk_obra_codigo INT,
                         FOREIGN KEY (fk_usuario_id) REFERENCES usuario(usuario_id) ON DELETE SET NULL,
                         FOREIGN KEY (fk_obra_codigo) REFERENCES obra(codigo) ON DELETE SET NULL
);

CREATE TABLE historico_de_visualizacao (
                                           id INT PRIMARY KEY AUTO_INCREMENT,
                                           fk_usuario_id INT,
                                           tempo_assistido DECIMAL(10,2) CHECK (tempo_assistido > 0),
                                           progresso_percentual DECIMAL(5,2) CHECK (progresso_percentual >= 0),
                                           FOREIGN KEY (fk_usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
);

CREATE TABLE lista_de_favoritos (
                                    id INT PRIMARY KEY AUTO_INCREMENT,
                                    fk_usuario_id INT,
                                    qnt_de_obra INT,
                                    ordem_de_exibicao INT,
                                    FOREIGN KEY (fk_usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
);

CREATE TABLE administra (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            fk_conta_codigo INT,
                            fk_conta_codigo_2 INT,
                            FOREIGN KEY (fk_conta_codigo) REFERENCES conta(codigo) ON DELETE CASCADE,
                            FOREIGN KEY (fk_conta_codigo_2) REFERENCES conta(codigo) ON DELETE CASCADE
);
CREATE TABLE pesquisa_streaming (
                                    id_resposta INT PRIMARY KEY AUTO_INCREMENT,
                                    email VARCHAR(255),
                                    ocupacao VARCHAR(100),
                                    regiao_residencia VARCHAR(100),
                                    genero VARCHAR(50),
                                    faixa_etaria VARCHAR(50),
                                    quantidade_assinaturas VARCHAR(20),
                                    servicos_utilizados TEXT,
                                    motivos_insatisfacao TEXT,
                                    generos_assistidos TEXT,
                                    frequencia_uso VARCHAR(50),
                                    horas_semanais VARCHAR(50),
                                    satisfacao_geral INT,
                                    satisfacao_recomendacoes INT,
                                    dispositivos_utilizados TEXT,
                                    preco_ideal_mensal VARCHAR(50)
);
 USE Streaming;
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
                                                                                       ('Básico com Anúncios', 25.90, 2, true),
                                                                                       ('Padrão', 39.90, 2, false),
                                                                                       ('Premium HD', 55.90, 4, false),
                                                                                       ('Família 4K', 70.00, 6, false);

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

INSERT INTO conta (data_expiracao, icone, status_assinatura) VALUES
                                                                 ('2026-10-20', 'avatar01.png', 'Ativa'), ('2025-11-15', 'avatar02.png', 'Ativa'), ('2025-09-22', 'avatar03.png', 'Cancelada'),
                                                                 ('2026-05-30', 'avatar04.png', 'Ativa'), ('2027-01-10', 'avatar05.png', 'Ativa'), ('2025-12-01', 'avatar06.png', 'Pendente'),
                                                                 ('2026-08-18', 'avatar07.png', 'Ativa'), ('2025-10-05', 'avatar08.png', 'Ativa'), ('2024-03-12', 'avatar09.png', 'Expirada'),
                                                                 ('2026-11-25', 'avatar10.png', 'Ativa'), ('2027-02-14', 'avatar11.png', 'Ativa'), ('2026-09-09', 'avatar12.png', 'Ativa'),
                                                                 ('2025-04-04', 'avatar13.png', 'Cancelada'), ('2026-06-07', 'avatar14.png', 'Ativa'), ('2026-07-19', 'avatar15.png', 'Ativa'),
                                                                 ('2025-08-30', 'avatar16.png', 'Pendente'), ('2026-12-21', 'avatar17.png', 'Ativa'), ('2027-03-01', 'avatar18.png', 'Ativa'),
                                                                 ('2023-11-11', 'avatar19.png', 'Expirada'), ('2026-02-28', 'avatar20.png', 'Ativa'), ('2026-04-15', 'avatar21.png', 'Ativa'),
                                                                 ('2025-10-10', 'avatar22.png', 'Ativa'), ('2025-06-13', 'avatar23.png', 'Cancelada'), ('2026-10-17', 'avatar24.png', 'Ativa'),
                                                                 ('2027-05-20', 'avatar25.png', 'Ativa'), ('2025-11-02', 'avatar26.png', 'Pendente'), ('2026-03-25', 'avatar27.png', 'Ativa'),
                                                                 ('2025-09-30', 'avatar28.png', 'Ativa'), ('2024-08-08', 'avatar29.png', 'Expirada'), ('2027-06-01', 'avatar30.png', 'Ativa');

INSERT INTO avaliacao (nota, data_avaliacao, texto) VALUES
                                                        (5, '2025-09-10', 'Excelente!'), (4, '2025-09-11', 'Muito bom, recomendo.'), (3, '2025-09-12', 'Razoável, esperava mais.'),
                                                        (5, '2025-09-13', 'Perfeito, um dos melhores que já vi.'), (2, '2025-09-14', 'Não gostei, enredo fraco.'),
                                                        (4, '2025-09-15', 'Ótima atuação.'), (1, '2025-09-16', 'Péssimo, perdi meu tempo.'), (5, '2025-09-17', 'Fotografia impecável.'),
                                                        (3, '2025-09-18', 'Começa bem, mas se perde no final.'), (4, '2025-09-19', 'Divertido.'),
                                                        (5, '2025-08-01', 'Obra de arte!'), (4, '2025-08-02', 'Surpreendente.'), (3, '2025-08-03', 'Ok.'),
                                                        (5, '2025-08-04', 'Inesquecível.'), (2, '2025-08-05', 'Decepcionante.'), (4, '2025-08-06', 'Vale a pena assistir.'),
                                                        (1, '2025-08-07', 'Muito ruim.'), (5, '2025-08-08', 'Fantástico!'), (3, '2025-08-09', 'Mediano.'),
                                                        (4, '2025-08-10', 'Inteligente.'), (5, '2025-07-20', 'Maravilhoso.'), (4, '2025-07-21', 'Prende a atenção.'),
                                                        (3, '2025-07-22', 'Poderia ser melhor.'), (5, '2025-07-23', 'Genial.'), (2, '2025-07-24', 'Chato.'),
                                                        (4, '2025-07-25', 'Emocionante.'), (1, '2025-07-26', 'Terrível.'), (5, '2025-07-27', 'Espetacular.'),
                                                        (3, '2025-07-28', 'Regular.'), (4, '2025-07-29', 'Muito bem feito.');

INSERT INTO comentario (texto, gostei) VALUES
                                           ('Adorei o final!', true), ('O protagonista é irritante.', false), ('Que plot twist!', true),
                                           ('A trilha sonora é incrível.', true), ('Achei o ritmo muito lento.', false), ('Me fez chorar.', true),
                                           ('Não entendi nada.', false), ('Maratonei em um dia!', true), ('Cenas de ação bem coreografadas.', true),
                                           ('Personagens sem profundidade.', false), ('Figurino impecável.', true), ('O humor é muito forçado.', false),
                                           ('Reassistindo pela terceira vez.', true), ('O livro é bem melhor.', false), ('Me identifiquei com a história.', true),
                                           ('Ansioso pela próxima temporada.', true), ('Cancelaram a série, que ódio.', false), ('Atuação de gala.', true),
                                           ('Efeitos especiais deixaram a desejar.', false), ('Um clássico moderno.', true), ('Superestimado.', false),
                                           ('Me surpreendeu positivamente.', true), ('O vilão rouba a cena.', true), ('Merecia mais reconhecimento.', true),
                                           ('Final decepcionante.', false), ('Para assistir com a família.', true), ('Muito pesado.', false),
                                           ('Direção genial.', true), ('História clichê.', false), ('Recomendo a todos.', true);

INSERT INTO usuario (nome, email, senha, fk_reclamacoes_reclamacoes_PK, rua, bairro, numero) VALUES
                                                                                                 ('Ana Silva', 'ana.silva@email.com', 'senha123', 1, 'Rua das Flores', 'Centro', 10),
                                                                                                 ('Bruno Costa', 'bruno.costa@email.com', 'costa321', 3, 'Avenida Principal', 'Jardins', 25),
                                                                                                 ('Carla Dias', 'carla.dias@email.com', 'dias123', 4, 'Rua da Praia', 'Copacabana', 150),
                                                                                                 ('Daniel Faria', 'daniel.faria@email.com', 'faria456', 2, 'Rua das Palmeiras', 'Tijuca', 33),
                                                                                                 ('Eduarda Lima', 'eduarda.lima@email.com', 'lima789', 5, 'Avenida Brasil', 'Moema', 1200),
                                                                                                 ('Fábio Melo', 'fabio.melo@email.com', 'melo123', 8, 'Rua Augusta', 'Consolação', 900),
                                                                                                 ('Gabriela Nunes', 'gabriela.nunes@email.com', 'nunes456', 6, 'Rua do Sol', 'Boa Viagem', 455),
                                                                                                 ('Heitor Almeida', 'heitor.almeida@email.com', 'almeida789', 11, 'Avenida Paulista', 'Bela Vista', 1800),
                                                                                                 ('Isabela Barros', 'isabela.barros@email.com', 'barros123', 9, 'Rua dos Pinheiros', 'Pinheiros', 750),
                                                                                                 ('João Pereira', 'joao.pereira@email.com', 'pereira456', 14, 'Rua da Lapa', 'Lapa', 210),
                                                                                                 ('Karina Rocha', 'karina.rocha@email.com', 'rocha789', 1, 'Avenida Ipiranga', 'República', 500),
                                                                                                 ('Lucas Martins', 'lucas.martins@email.com', 'martins123', 3, 'Rua Frei Caneca', 'Cerqueira César', 130),
                                                                                                 ('Mariana Gomes', 'mariana.gomes@email.com', 'gomes456', 7, 'Rua Sete de Setembro', 'Centro', 180),
                                                                                                 ('Nelson Oliveira', 'nelson.oliveira@email.com', 'oliveira789', 12, 'Avenida Rio Branco', 'Centro', 99),
                                                                                                 ('Otávio Souza', 'otavio.souza@email.com', 'souza123', 15, 'Rua da Alfândega', 'Saúde', 250),
                                                                                                 ('Paula Fernandes', 'paula.fernandes@email.com', 'fernandes456', 18, 'Rua Visconde de Pirajá', 'Ipanema', 340),
                                                                                                 ('Quintino Borges', 'quintino.borges@email.com', 'borges789', 20, 'Avenida Atlântica', 'Leme', 700),
                                                                                                 ('Renata Azevedo', 'renata.azevedo@email.com', 'azevedo123', 10, 'Rua Haddock Lobo', 'Jardim Paulista', 1100),
                                                                                                 ('Sérgio Castro', 'sergio.castro@email.com', 'castro456', 22, 'Rua Oscar Freire', 'Jardins', 555),
                                                                                                 ('Tatiana Ribeiro', 'tatiana.ribeiro@email.com', 'ribeiro789', 13, 'Alameda Santos', 'Paraíso', 2000),
                                                                                                 ('Ulisses Neves', 'ulisses.neves@email.com', 'neves123', 25, 'Rua da Quitanda', 'Centro', 80),
                                                                                                 ('Vanessa Ramos', 'vanessa.ramos@email.com', 'ramos456', 1, 'Rua Barão de Itapetininga', 'Vila Buarque', 120),
                                                                                                 ('William Santos', 'william.santos@email.com', 'santos789', 3, 'Avenida Angélica', 'Higienópolis', 1500),
                                                                                                 ('Xavier Pinto', 'xavier.pinto@email.com', 'pinto123', 4, 'Rua Maria Antônia', 'Consolação', 294),
                                                                                                 ('Yara Mendonça', 'yara.mendonca@email.com', 'mendonca456', 16, 'Avenida Higienópolis', 'Higienópolis', 618),
                                                                                                 ('Zélia Cardoso', 'zelia.cardoso@email.com', 'cardoso789', 19, 'Rua da Consolação', 'Jardins', 222),
                                                                                                 ('André Barbosa', 'andre.barbosa@email.com', 'barbosa123', 21, 'Rua Itambé', 'Higienópolis', 45),
                                                                                                 ('Beatriz Tavares', 'beatriz.tavares@email.com', 'tavares456', 24, 'Avenida Nove de Julho', 'Jardim Paulista', 3000),
                                                                                                 ('Caio Drummond', 'caio.drummond@email.com', 'drummond789', 2, 'Rua Pamplona', 'Jardim Paulista', 800),
                                                                                                 ('Débora Freire', 'debora.freire@email.com', 'freire123', 5, 'Rua Bela Cintra', 'Cerqueira César', 1700);

INSERT INTO obra (nome, sinopse, fk_genero_genero_PK, data_lancamento, qnt_temporadas, duracao, obra_TIPO) VALUES
                                                                                                               ('Cidade de Deus', 'A vida na favela sob a ótica do crime, da amizade e da vingança.', 14, '2002-08-30', NULL, '02:10:00', 1),
                                                                                                               ('Tropa de Elite', 'A rotina de um capitão do BOPE que busca um substituto enquanto lida com a pressão do trabalho e da família.', 1, '2007-10-05', NULL, '01:55:00', 1),
                                                                                                               ('O Auto da Compadecida', 'As aventuras de João Grilo e Chicó, dois nordestinos pobres que vivem de golpes para sobreviver.', 2, '2000-09-15', NULL, '01:44:00', 1),
                                                                                                               ('Bacurau', 'Após a morte da matriarca, uma cidade do sertão brasileiro some misteriosamente do mapa.', 6, '2019-08-29', NULL, '02:11:00', 1),
                                                                                                               ('3%', 'Em um futuro distópico, jovens competem em um processo seletivo brutal por uma chance de viver em um paraíso.', 4, '2016-11-25', 4, '00:49:00', 2),
                                                                                                               ('Coisa Mais Linda', 'Uma mulher forte abre um clube de bossa nova no Rio de Janeiro dos anos 50, desafiando a sociedade.', 3, '2019-03-22', 2, '00:52:00', 2),
                                                                                                               ('A Origem', 'Um ladrão de sonhos enfrenta seu último e mais desafiador trabalho: implantar uma ideia na mente de alguém.', 4, '2010-08-06', NULL, '02:28:00', 1),
                                                                                                               ('Parasita', 'Uma família pobre se infiltra de forma engenhosa na vida de uma família rica, com consequências inesperadas.', 6, '2019-11-07', NULL, '02:12:00', 1),
                                                                                                               ('A Viagem de Chihiro', 'Uma menina de 10 anos se perde em um mundo mágico e misterioso habitado por deuses e monstros.', 9, '2003-07-18', NULL, '02:05:00', 1),
                                                                                                               ('The Office', 'Documentário cômico sobre o dia a dia de funcionários excêntricos em um escritório de uma empresa de papel.', 27, '2005-03-24', 9, '00:22:00', 2),
                                                                                                               ('Breaking Bad', 'Um professor de química com câncer terminal começa a produzir metanfetamina para garantir o futuro de sua família.', 3, '2008-01-20', 5, '00:47:00', 2),
                                                                                                               ('O Poderoso Chefão', 'A saga de uma família mafiosa italiana em Nova York e a ascensão de Michael Corleone ao poder.', 14, '1972-09-08', NULL, '02:55:00', 1),
                                                                                                               ('Matrix', 'Um hacker descobre que sua realidade é uma simulação e se junta a uma rebelião contra as máquinas.', 4, '1999-05-21', NULL, '02:16:00', 1),
                                                                                                               ('Forrest Gump', 'A história da vida de um homem simples com um QI baixo, mas boas intenções, que testemunha eventos históricos.', 7, '1994-12-07', NULL, '02:22:00', 1),
                                                                                                               ('Game of Thrones', 'Famílias nobres de Westeros disputam o Trono de Ferro em uma trama de política, guerra e fantasia.', 11, '2011-04-17', 8, '00:55:00', 2),
                                                                                                               ('Interestelar', 'Em um futuro onde a Terra está morrendo, uma equipe de astronautas viaja por um buraco de minhoca em busca de um novo lar.', 4, '2014-11-06', NULL, '02:49:00', 1),
                                                                                                               ('Fleabag', 'A vida de uma jovem de luto e com humor ácido em Londres.', 2, '2016-07-21', 2, '00:27:00', 2),
                                                                                                               ('Chernobyl', 'Minissérie que dramatiza a história do desastre nuclear de 1986.', 18, '2019-05-06', 1, '01:05:00', 2),
                                                                                                               ('O Silêncio dos Inocentes', 'Uma agente do FBI busca a ajuda de um brilhante assassino para capturar outro serial killer.', 24, '1991-05-31', NULL, '01:58:00', 1),
                                                                                                               ('Clube da Luta', 'Um homem insone e um vendedor de sabão criam um clube de luta clandestino.', 21, '1999-10-29', NULL, '02:19:00', 1),
                                                                                                               ('Pulp Fiction', 'As vidas de dois assassinos de aluguel e outros personagens se entrelaçam.', 14, '1994-10-14', NULL, '02:34:00', 1),
                                                                                                               ('Vingadores: Ultimato', 'Os heróis restantes da Marvel se unem para uma última cartada contra Thanos.', 25, '2019-04-25', NULL, '03:01:00', 1),
                                                                                                               ('Coringa', 'Em Gotham, um comediante fracassado busca conexão enquanto a cidade mergulha no caos.', 3, '2019-10-03', NULL, '02:02:00', 1),
                                                                                                               ('Stranger Things', 'Um grupo de crianças em uma cidade pequena nos anos 80 descobre mistérios sobrenaturais.', 5, '2016-07-15', 4, '00:51:00', 2),
                                                                                                               ('A Casa de Papel', 'Um grupo de assaltantes executa um plano ambicioso para roubar a Casa da Moeda da Espanha.', 6, '2017-05-02', 5, '00:45:00', 2),
                                                                                                               ('Sintonia', 'A história de três jovens da periferia de São Paulo que lutam para realizar seus sonhos.', 3, '2019-08-09', 3, '00:40:00', 2),
                                                                                                               ('Bom Dia, Verônica', 'Uma escrivã da polícia investiga por conta própria dois casos arquivados.', 14, '2020-10-01', 2, '00:48:00', 2),
                                                                                                               ('O Menino e o Mundo', 'Um garoto sai em busca de seu pai em uma aventura que retrata os problemas do mundo moderno.', 9, '2014-01-17', NULL, '01:20:00', 1),
                                                                                                               ('Que Horas Ela Volta?', 'A chegada da filha da empregada doméstica na casa dos patrões abala a estrutura social.', 3, '2015-08-27', NULL, '01:52:00', 1),
                                                                                                               ('O Irlandês', 'A vida de um assassino de aluguel da máfia e seu envolvimento no desaparecimento de Jimmy Hoffa.', 17, '2019-11-27', NULL, '03:29:00', 1);

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

INSERT INTO dirige (fk_diretor_id, fk_obra_codigo) VALUES
                                                       (1, 1),(4, 2), (20, 1), (6, 4), (13, 7),(15, 8), (24, 9),(12, 30),
                                                       (14, 14),(13, 16), (23, 20), (11, 21), (5, 29), (1, 6), (4, 27),
                                                       (11, 12), (12, 21), (10, 28), (16, 8), (17, 7),(18, 17), (19, 16),
                                                       (21, 22),(22, 19),(25, 3),(26, 2),(27, 9),(28, 24), (29, 6), (30, 5);

INSERT INTO episodio (fk_obra_codigo, numero_temporada, numero, duracao) VALUES
                                                                             (5, 1, 1, '00:48:00'), (5, 1, 2, '00:51:00'), (5, 2, 1, '00:49:00'), (6, 1, 1, '00:53:00'), (6, 1, 2, '00:50:00'),
                                                                             (6, 2, 1, '00:55:00'), (10, 1, 1, '00:21:00'), (10, 1, 2, '00:23:00'), (10, 2, 1, '00:22:00'), (11, 1, 1, '00:47:00'),
                                                                             (11, 1, 2, '00:48:00'), (11, 2, 1, '00:46:00'), (15, 1, 1, '00:58:00'), (15, 1, 2, '00:56:00'), (15, 2, 1, '00:59:00'),
                                                                             (17, 1, 1, '00:26:00'), (17, 1, 2, '00:28:00'), (17, 2, 1, '00:25:00'), (18, 1, 1, '01:03:00'), (18, 1, 2, '01:08:00'),
                                                                             (24, 1, 1, '00:50:00'), (24, 1, 2, '00:52:00'), (24, 2, 1, '00:51:00'), (25, 1, 1, '00:44:00'), (25, 1, 2, '00:46:00'),
                                                                             (25, 2, 1, '00:43:00'), (26, 1, 1, '00:41:00'), (26, 1, 2, '00:39:00'), (27, 1, 1, '00:47:00'), (27, 1, 2, '00:49:00');

INSERT INTO assiste (fk_usuario_id, fk_obra_codigo) VALUES
                                                        (1, 1), (1, 5), (2, 2), (3, 7), (4, 11), (5, 15), (6, 24), (7, 8), (8, 25), (9, 1),
                                                        (10, 10), (11, 16), (12, 20), (13, 21), (14, 4), (15, 6), (16, 18), (17, 22), (18, 3), (19, 12),
                                                        (20, 13), (21, 17), (22, 26), (23, 29), (24, 30), (25, 9), (26, 27), (27, 11), (28, 24), (29, 1);

INSERT INTO faz_comentario_avaliacao_usuario (fk_usuario_id, fk_comentario_codigo, fk_avaliacao_codigo) VALUES
                                                                                                            (1, 1, 1), (2, 2, 2), (3, 3, 3), (4, 4, 4), (5, 5, 5), (6, 6, 6), (7, 7, 7), (8, 8, 8), (9, 9, 9), (10, 10, 10),
                                                                                                            (11, 11, 11), (12, 12, 12), (13, 13, 13), (14, 14, 14), (15, 15, 15), (16, 16, 16), (17, 17, 17), (18, 18, 18), (19, 19, 19), (20, 20, 20),
                                                                                                            (21, 21, 21), (22, 22, 22), (23, 23, 23), (24, 24, 24), (25, 25, 25), (26, 26, 26), (27, 27, 27), (28, 28, 28), (29, 29, 29), (30, 30, 30);

INSERT INTO historico_de_visualizacao (fk_usuario_id, tempo_assistido, progresso_percentual) VALUES
                                                                                                 (1, 7800.50, 99.50), (2, 3200.00, 45.10), (3, 8820.00, 100.00), (4, 1500.75, 25.00), (5, 4500.00, 50.25),
                                                                                                 (6, 9200.00, 100.00), (7, 650.20, 10.80), (8, 2400.00, 33.33), (9, 5600.00, 80.00), (10, 1234.56, 15.70),
                                                                                                 (11, 6800.00, 100.00), (12, 4980.00, 75.00), (13, 300.00, 5.00), (14, 7100.00, 92.40), (15, 10800.00, 100.00),
                                                                                                 (16, 999.00, 12.00), (17, 4250.50, 55.50), (18, 5400.00, 68.90), (19, 8100.00, 99.00), (20, 3300.00, 40.00),
                                                                                                 (21, 5000.00, 100.00), (22, 1800.00, 22.80), (23, 750.00, 9.50), (24, 6320.00, 81.20), (25, 11000.00, 100.00),
                                                                                                 (26, 2040.00, 30.00), (27, 4800.00, 66.70), (28, 3150.80, 45.00), (29, 9500.00, 100.00), (30, 800.00, 8.80);

INSERT INTO lista_de_favoritos (fk_usuario_id, qnt_de_obra, ordem_de_exibicao) VALUES
                                                                                   (1, 15, 1), (2, 5, 2), (3, 32, 1), (4, 8, 3), (5, 50, 1), (6, 22, 2), (7, 12, 1), (8, 3, 1), (9, 28, 3), (10, 19, 2),
                                                                                   (11, 41, 1), (12, 11, 1), (13, 9, 2), (14, 33, 1), (15, 18, 2), (16, 7, 3), (17, 25, 1), (18, 13, 1), (19, 45, 2), (20, 21, 1),
                                                                                   (21, 17, 3), (22, 38, 2), (23, 6, 1), (24, 29, 1), (25, 10, 2), (26, 4, 1), (27, 23, 3), (28, 16, 1), (29, 31, 2), (30, 20, 1);

INSERT INTO administra (fk_conta_codigo, fk_conta_codigo_2) VALUES
                                                                (1, 2), (1, 3), (4, 5), (4, 6), (7, 8), (9, 10), (9, 11), (9, 12), (13, 14), (15, 16),
                                                                (15, 17), (18, 19), (20, 21), (20, 22), (20, 23), (20, 24), (25, 26), (25, 27), (28, 29), (28, 30),
                                                                (1, 4), (2, 5), (3, 6), (7, 9), (8, 10), (11, 13), (14, 15), (16, 18), (17, 19), (21, 22);



INSERT INTO pesquisa_streaming (email, ocupacao, regiao_residencia, genero, faixa_etaria, quantidade_assinaturas, servicos_utilizados, motivos_insatisfacao, generos_assistidos, frequencia_uso, horas_semanais, satisfacao_geral, satisfacao_recomendacoes, dispositivos_utilizados, preco_ideal_mensal) VALUES
                                                                                                                                                                                                                                                                                                              ('manoelcarreiroa@gmail.com', 'Autônomo(a)', 'Região Nordeste', 'Masculino', 'Entre 50 e 70 anos', '2', 'Netflix, Amazon Prime Video', 'Títulos dessinteressantes, Falta de produções originais de qualidade, Limitação de telas, Conteúdo limitado ou repetitivo, Propagandas', 'Ação, Comédia, Drama, Documentário, Romance', 'Semanalmente', 'Até 4 horas', 4, 4, 'TV', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('lsncb.leticia.pessoal@gmail.com', NULL, 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '2', 'Netflix', 'Títulos dessinteressantes, Falta de produções originais de qualidade, Conteúdo limitado ou repetitivo, Preço elevado, Propagandas, pouca variedade e filmes ruins', 'Comédia, Drama, Romance', 'Raramente', '3', NULL, 3, 'TV, Computador/Notebook, Dispositivo de streaming (Ex: Chromecast, Fire TV Stick)', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('segurosmedicosusa@gmail.com', 'Autônomo(a)', 'Estados Unidos', 'Masculino', 'Entre 30 e 50 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Apple TV, Paramount Plus', 'Falta de produções originais de qualidade, Limitação de telas, Conteúdo limitado ou repetitivo', 'Ação, Comédia, Documentário', 'Raramente', 'Raramente', 4, 4, 'TV, Smartphone, Computador/Notebook', 'Acima de R$50,00'),
                                                                                                                                                                                                                                                                                                              ('fafhcavalcanti@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 30 e 50 anos', '2', 'Crunchyroll', 'Títulos dessinteressantes', 'Drama, Ficção Científica, Animação', 'Semanalmente', 'Até 4 horas', 4, 4, 'Computador/Notebook', 'Acima de R$50,00'),
                                                                                                                                                                                                                                                                                                              ('b.cardoso.araujo@gmail.com', 'CLT', 'Região Sul', 'Feminino', 'Entre 18 e 30 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max', 'Conteúdo limitado ou repetitivo, Preço elevado, Propagandas', 'Drama, Documentário, Romance', 'Semanalmente', 'Até 4 horas', 4, 4, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('vdmdf2016@gmail.com', 'Integrante de empresa júnior', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Crunchyroll', 'Títulos dessinteressantes', 'Ação, Comédia, Drama, Animação, Romance', 'Diariamente', 'Até 4 horas', 5, 4, 'Smartphone, Computador/Notebook, Dispositivo de streaming (Ex: Chromecast, Fire TV Stick)', 'Entre R$30,00 e R$50,00'),
                                                                                                                                                                                                                                                                                                              ('ibn@cesar.school', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play, Apple TV, Crunchyroll', 'Títulos dessinteressantes, Preço elevado', 'Ação, Comédia, Ficção Científica, Animação', 'Semanalmente', 'Até 2 horas', 4, 4, 'TV, Smartphone, Computador/Notebook', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('joaopedrodmv21@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+', 'Conteúdo limitado ou repetitivo, Preço elevado, Propagandas', 'Ação, Comédia, Animação, Romance', 'Semanalmente', 'Até 2 horas', 3, 4, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('rft@cesar.school', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, HBO Max, Paramount Plus, Crunchyroll', 'Títulos dessinteressantes, Varia mto de cada uma', 'Comédia, Terror', 'Mensalmente', 'Raramente', 4, 3, 'TV, Tablet', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('gabriel.fcarvalho@upe.br', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '3', 'Netflix, Amazon Prime Video, Apple TV', 'Títulos dessinteressantes, Conteúdo limitado ou repetitivo', 'Comédia, Documentário, Animação', 'Raramente', 'Raramente', 2, 1, 'TV', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('eduardoscavalcantij@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '3', 'Netflix, Amazon Prime Video, Crunchyroll', 'Títulos dessinteressantes, Limitação de telas, Conteúdo limitado ou repetitivo, Preço elevado, Propagandas', 'Comédia, Ficção Científica, Animação', 'Raramente', 'Raramente', 4, 4, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('mcr@cesar.school', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, HBO Max, Paramount Plus, Crunchyroll', 'Títulos dessinteressantes, Preço elevado, Propagandas', 'Ação, Comédia, Ficção Científica, Animação', 'Diariamente', 'Até 2 horas', 3, 3, 'Smartphone, Computador/Notebook', 'Até R$15,00'),
                                                                                                                                                                                                                                                                                                              ('gabrielfribeiro04@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '3', 'Netflix, Amazon Prime Video, HBO Max', 'Títulos dessinteressantes', 'Ação, Drama, Ficção Científica', 'Semanalmente', 'Até 4 horas', 2, 4, 'TV, Computador/Notebook', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('ana.rangels@ufpe.br', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '2', 'Netflix, Amazon Prime Video', 'Títulos dessinteressantes, Falta de atualização, Limitação de telas, Preço elevado, Propagandas', 'Comédia, Drama, Ficção Científica, Terror, Romance', 'Diariamente', 'Até 2 horas', 2, 3, 'TV, Smartphone, Tablet', 'Até R$15,00'),
                                                                                                                                                                                                                                                                                                              ('jfilipej1@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '1', 'Netflix', 'Limitação de telas', 'Ação, Comédia, Documentário', 'Semanalmente', 'Até 2 horas', 4, 4, 'TV, Computador/Notebook', 'Até R$15,00'),
                                                                                                                                                                                                                                                                                                              ('ceciliaeeskinazi@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, HBO Max, Globo play, Apple TV', 'Preço elevado, Propagandas', 'Ficção Científica, Terror, Romance', 'Semanalmente', 'Até 4 horas', 4, 4, 'TV, Computador/Notebook', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('mariajulinhagomes12@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+, HBO Max', 'Falta de produções originais de qualidade, Limitação de telas, Preço elevado, Propagandas', 'Comédia, Romance', 'Mensalmente', 'Até 2 horas', 4, 3, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('gigimaal2019@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Disney+, HBO Max, Globo play, Paramount Plus', 'Títulos dessinteressantes, Falta de atualização, Preço elevado, Propagandas', 'Ação, Comédia, Ficção Científica, Animação, Romance', 'Raramente', 'Raramente', 3, 3, 'Computador/Notebook', 'Entre R$30,00 e R$50,00'),
                                                                                                                                                                                                                                                                                                              ('anamariiaalves05@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play', 'Preço elevado', 'Ação, Drama', 'Diariamente', 'Até 4 horas', 5, 5, 'TV, Smartphone, Tablet', 'Entre R$30,00 e R$50,00'),
                                                                                                                                                                                                                                                                                                              ('estersoutto1@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Disney+, Globo play', 'Títulos dessinteressantes', 'Comédia, Drama, Romance', 'Diariamente', 'Até 4 horas', 3, 3, 'TV, Tablet', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('michelecarla988@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '1', 'Netflix', 'Títulos dessinteressantes', 'Comédia, Terror, Animação, Romance', 'Raramente', 'Raramente', 4, 3, 'TV, Smartphone, Tablet', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('gmdf@cesar.school', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '2', 'Amazon Prime Video, Disney+', 'Preço elevado, Propagandas', 'Ação, Comédia, Animação, Romance', 'Semanalmente', 'Mais que 4 horas', 1, 1, 'TV, Computador/Notebook, Dispositivo de streaming (Ex: Chromecast, Fire TV Stick)', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('mariafernandamalta0006@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '3', 'Netflix, Amazon Prime Video, HBO Max, Globo play', 'Títulos dessinteressantes, Falta de atualização, Preço elevado, Propagandas', 'Ação, Comédia, Romance', 'Semanalmente', 'Até 2 horas', 4, 5, 'Smartphone, Tablet', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('lipe2101@gmail.com', 'Estagiário', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play, Apple TV', 'Títulos dessinteressantes, Falta de atualização, Limitação de telas, Conteúdo limitado ou repetitivo, Preço elevado, Propagandas', 'Ação, Comédia, Documentário', 'Diariamente', 'Mais que 4 horas', 4, 4, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('malu.abreu.tenorio@gmail.com', 'Estudante', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Amazon Prime Video, Disney+, HBO Max', 'Falta de produções originais de qualidade, Limitação de telas', 'Ação, Comédia, Drama, Romance', 'Diariamente', 'Mais que 4 horas', 3, 2, 'TV, Tablet', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('carolina.argusmao@gmail.com', 'CLT', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '6 ou mais', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play, Apple TV', 'Limitação de telas, Propagandas', 'Ação, Comédia, Romance', 'Semanalmente', 'Mais que 4 horas', 4, 4, 'TV', 'Acima de R$50,00'),
                                                                                                                                                                                                                                                                                                              ('bia.gusmao09@gmail.com', 'Autônomo(a)', 'Região Nordeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play', 'Títulos dessinteressantes, Falta de atualização, Conteúdo limitado ou repetitivo', 'Ação, Comédia, Drama, Ficção Científica, Documentário, Romance', 'Diariamente', 'Mais que 4 horas', 4, 3, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('andrea.araujo@fundaj.gov.br', 'Servidor público', 'Região Nordeste', 'Feminino', 'Entre 50 e 70 anos', '4 a 5', 'Netflix, Amazon Prime Video, Globo play', NULL, 'Ação, Drama, Documentário, Romance', 'Diariamente', 'Até 4 horas', 4, 4, 'TV', 'Entre R$30,00 e R$50,00'),
                                                                                                                                                                                                                                                                                                              ('robertaaraujogusmao@gmail.com', 'Autônomo(a)', 'Região Nordeste', 'Feminino', 'Entre 50 e 70 anos', '3', 'Netflix, Amazon Prime Video, Globo play', 'Limitação de telas', 'Ação, Drama, Documentário', 'Semanalmente', 'Mais que 4 horas', 4, 4, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('lucasgbcorreia@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Globo play', 'Preço elevado, Propagandas', 'Ação, Comédia, Terror', 'Diariamente', 'Mais que 4 horas', 3, 4, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('erika.gusmao@trt6.jus.br', 'Servidora pública federal', 'Região Nordeste', 'Feminino', 'Entre 30 e 50 anos', '3', 'Netflix, Amazon Prime Video, Disney+', NULL, 'Ação, Comédia, Romance', 'Semanalmente', 'Até 4 horas', 4, 3, 'TV', 'Entre R$30,00 e R$50,00'),
                                                                                                                                                                                                                                                                                                              ('matheusbarbosaaguiar@gmail.com', 'CLT', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '3', 'Amazon Prime Video, Disney+', NULL, 'Ficção Científica, Documentário, Terror', 'Semanalmente', 'Até 4 horas', 5, 5, 'TV, Computador/Notebook', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('rico.dgusmao@gmail.com', 'Autônomo(a)', 'Região Nordeste', 'Masculino', 'Entre 50 e 70 anos', '3', 'Netflix, Amazon Prime Video, Disney+, Globo play', 'Títulos dessinteressantes, Preço elevado', 'Ação, Comédia, Drama, Romance', 'Semanalmente', 'Até 2 horas', 4, 3, 'TV, Smartphone', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('aarruda2012@gmail.com', 'Professor', 'Região Nordeste', 'Feminino', 'Entre 50 e 70 anos', '6 ou mais', 'Netflix', 'Títulos dessinteressantes, Falta de atualização, Conteúdo limitado ou repetitivo', 'Comédia, Drama, Ficção Científica, Romance', 'Mensalmente', 'Raramente', 2, 2, 'TV', 'Entre R$15,00 e R$30,00'),
                                                                                                                                                                                                                                                                                                              ('dudapaivaa13@gmail.com', 'Estudante', 'Região Sudeste', 'Feminino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+, Globo play', 'Títulos dessinteressantes, Falta de atualização, Preço elevado, Propagandas', 'Comédia, Romance', 'Semanalmente', 'Até 2 horas', 4, 2, 'TV', 'Até R$15,00'),
                                                                                                                                                                                                                                                                                                              ('caioaquino2205@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+, Globo play, Crunchyroll', 'Propagandas', 'Ação, Comédia, Ficção Científica, Terror, Animação', 'Semanalmente', 'Até 4 horas', 5, 3, 'TV, Smartphone', 'Entre R$30,00 e R$50,00'),
                                                                                                                                                                                                                                                                                                              ('luizpierrehenrique@gmail.com', 'Estudante', 'Região Nordeste', 'Masculino', 'Entre 18 e 30 anos', '4 a 5', 'Netflix, Amazon Prime Video, Disney+, HBO Max, Apple TV', 'Conteúdo limitado ou repetitivo', 'Ação, Comédia, Terror, Animação', 'Semanalmente', 'Até 4 horas', 3, 4, 'TV, Smartphone, Computador/Notebook', 'Entre R$30,00 e R$50,00');