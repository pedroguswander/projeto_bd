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
                          FOREIGN KEY (fk_obra_codigo) REFERENCES obra(codigo) ON DELETE RESTRICT
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
                        FOREIGN KEY (fk_obra_codigo) REFERENCES obra(codigo) ON DELETE RESTRICT
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
