# Projeto BD - Servico de Streaming

## Rodando com Docker

O jeito principal de rodar o projeto agora e pelo Docker Compose. Ele sobe:

- MySQL 8.4 em um container proprio
- Backend Spring Boot conectado nesse MySQL
- Frontend React

```bash
docker compose up --build
```

Servicos expostos:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3307`

Dentro da rede Docker, o backend nao usa `localhost` para acessar o banco. Ele usa o host interno `db`, configurado no `docker-compose.yml`:

```yaml
DB_HOST: db
DB_PORT: 3306
DB_NAME: StreamingAtualizado2
```

O `localhost` que aparece em `serivco_streaming/src/main/resources/application.properties` e apenas fallback para quando o backend for executado fora do Docker.

## Banco no Docker

Na primeira subida, o MySQL executa automaticamente os scripts em `/docker-entrypoint-initdb.d`:

- `serivco_streaming/createAndInsertAtualizado.sql`
- `docker/mysql/init/02-views-routines-triggers.sql`

Esse segundo script concentra indices, views, functions, procedures e triggers usados pelo backend.

Os dados ficam persistidos no volume Docker `streaming_mysql_data`. Por isso, os scripts de inicializacao so rodam quando o volume ainda nao existe. Para recriar o banco do zero:

```bash
docker compose down -v
docker compose up --build
```

## Configuracao

Crie um `.env` a partir de `.env.example` se quiser mudar portas, nome do banco ou senha:

```env
DB_NAME=StreamingAtualizado2
DB_USER=root
DB_PASSWORD=1234
MYSQL_PORT=3307
BACKEND_PORT=8080
FRONTEND_PORT=3000
```

## Rodando sem Docker

Se voce quiser rodar o backend direto pela IDE/Maven, ai sim precisa ter um MySQL local compativel com os valores de fallback do `application.properties`, ou definir as variaveis `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD` no ambiente.

## Entregas SQL

Os arquivos SQL originais da disciplina continuam em `serivco_streaming/`. Para o ambiente Docker, o que e carregado automaticamente fica referenciado no `docker-compose.yml`.
