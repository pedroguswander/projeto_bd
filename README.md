# Serviço de Streaming

Este é um projeto de serviço de streaming. Este README provê as instruções necessárias para configurar e rodar a aplicação localmente.

---

## 🚀 Pré-requisitos

Para rodar este projeto, você precisará ter o seguinte software instalado em sua máquina:

* **Java Development Kit (JDK)** (versão recomendada: 17 ou superior)
* **MySQL Server** (Qualquer versão recente deve funcionar.)
* **Maven** (Para gerenciar as dependências e o build do projeto.)

---

## ⚙️ Configuração do Banco de Dados

A aplicação usa o MySQL para persistir os dados. Siga os passos abaixo para configurar o banco de dados:

1.  **Instalar o MySQL:** Se você ainda não tem, instale o **MySQL Server** na sua máquina.
2.  **Acessar o MySQL:** Abra seu cliente MySQL (como MySQL Workbench, DBeaver, ou linha de comando) e conecte-se.

    * A aplicação está configurada para se conectar em `jdbc:mysql://localhost:3306/Streaming` com as seguintes credenciais:
        * **Usuário:** `root`
        * **Senha:** `1234`

    **⚠️ Importante:** Se você usa outras credenciais para o seu usuário `root` ou se não quer usar o `root`, você deve criar um usuário ou alterar as configurações no arquivo de propriedades do Spring para as suas credenciais.

3.  **Executar o Script SQL:**
    * Localize o arquivo **`createAndInsert.sql`** na raiz do projeto (ou no local onde ele estiver armazenado).
    * **Execute todo o conteúdo deste script** no seu MySQL.
    * Este script irá:
        * Criar o *schema* (`database`) chamado **`Streaming`**.
        * Criar as tabelas necessárias.
        * Inserir dados iniciais de teste.

---

## 🛠️ Executando a Aplicação

Com o banco de dados configurado e populado, você pode iniciar a aplicação:

1.  **Baixar o Projeto:** Clone o repositório ou baixe o código-fonte do projeto para sua máquina.
2.  **Abrir o Projeto:** Abra o projeto em sua IDE favorita (IntelliJ IDEA, Eclipse, VS Code, etc.).
3.  **Compilar e Rodar:**
    * **Via IDE:** Use a função de "Run" da sua IDE no arquivo principal da aplicação (geralmente uma classe que contém o método `main` e a anotação `@SpringBootApplication`).
    * **Via Linha de Comando (Maven):** Navegue até o diretório raiz do projeto no terminal e execute os seguintes comandos:

        ```bash
        # Limpa e empacota o projeto em um arquivo JAR
        mvn clean package
        
        # Executa o arquivo JAR gerado na pasta 'target'
        # O nome do arquivo pode variar, substitua-o pelo nome correto
        java -jar target/nome-do-seu-jar.jar 
        ```

4.  **Acesso:** Após a inicialização bem-sucedida, a aplicação estará rodando. Normalmente, o servidor estará disponível em `http://localhost:8080/`. Consulte a documentação da API ou a interface web, se houver, para os próximos passos.

---

### 💡 Solução de Problemas Comuns

* **Erro de Conexão com o Banco de Dados:** Verifique se o **MySQL Server** está em execução e se as credenciais (`username` e `password`) e a URL (`localhost:3306`) no arquivo de configuração do Spring (seja ele `application.properties` ou `application.yml`) correspondem ao seu setup local.
* **"Porta 8080 já está em uso":** Se outra aplicação estiver usando a porta 8080, você pode alterar a porta de execução do projeto no arquivo de configuração do Spring (adicionando a linha `server.port=NOVA_PORTA`).
