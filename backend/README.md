# StalkerDeAluno — Backend
---

# Tecnologias utilizadas

* Node.js — ambiente de execução JavaScript
* Express — framework para construção da API HTTP
* CORS — liberação de acesso entre frontend e backend

---

# Estrutura do projeto

```
backend/
├── index.js
├── package.json
└── src/
    ├── controllers/
    │   └── alunoController.js
    ├── data/
    │   └── alunos.js
    └── router/
        └── alunoRoutes.js
```

## Organização das pastas

| Pasta/Arquivo  | Responsabilidade                                      |
| -------------- | ----------------------------------------------------- |
| `index.js`     | Inicialização do servidor Express                     |
| `controllers/` | Regras de negócio, validações e manipulação dos dados |
| `data/`        | Armazenamento temporário dos alunos em memória        |
| `router/`      | Definição das rotas da API                            |

---

# Como executar o projeto

## Pré-requisitos

* Node.js v18 ou superior
* npm instalado

---

## Instalação das dependências

Dentro da pasta `backend/`, execute:

<!-- o "bash" é para deixar destacado no md, não é um comando -->

```bash
npm install
```

---

## Inicializando o servidor

```bash
npm run dev
```

Servidor disponível em:

```bash
http://localhost:3000
```

Mensagem esperada no terminal:

```bash
Servidor está on http://localhost:3000/alunos
```

---

# Endpoints da API

Base URL:

```bash
http://localhost:3000
```

| Método | Endpoint                     | Descrição                 |
| ------ | ---------------------------- | ------------------------- |
| GET    | `/alunos/tabelaDeAlunos`     | Lista todos os alunos     |
| POST   | `/alunos/tabelaDeAlunos`     | Cadastra um novo aluno    |
| PUT    | `/alunos/tabelaDeAlunos/:id` | Atualiza um aluno pelo ID |
| DELETE | `/alunos/tabelaDeAlunos/:id` | Remove um aluno pelo ID   |

---

# Estrutura dos dados

## Corpo da requisição

Utilizado nos métodos `POST` e `PUT`.

```json
{
  "nome": "Maria Silva",
  "email": "maria@gmail.com",
  "curso": "Desenvolvimento Web",
  "nota": 8.5
}
```

---

## Campos disponíveis

| Campo   | Tipo   | Obrigatório | Regras                                  |
| ------- | ------ | ----------- | --------------------------------------- |
| `nome`  | string | Sim         | Máximo de 100 caracteres                |
| `email` | string | Sim         | Deve possuir formato válido e ser único |
| `curso` | string | Sim         | Campo obrigatório                       |
| `nota`  | number | Não         | Valor entre 0 e 10                      |

---

## Resposta de sucesso

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@gmail.com",
  "curso": "Desenvolvimento Web",
  "nota": 8.5
}
```

---

# Validações e tratamento de erros

| Situação                         | Status HTTP | Resposta                                           |
| -------------------------------- | ----------- | -------------------------------------------------- |
| Campos obrigatórios ausentes     | 400         | `"Nome, email e curso são obrigatórios."`          |
| Nome acima de 100 caracteres     | 400         | `"Nome não pode ter mais de 100 caracteres."`      |
| E-mail inválido                  | 400         | `"O formato do e-mail informado é inválido."`      |
| E-mail já cadastrado             | 409         | `"Já existe um aluno cadastrado com esse e-mail."` |
| Nota fora do intervalo permitido | 422         | `"A nota deve ser um valor entre 0 e 10."`         |
| ID não encontrado                | 404         | `"Nenhum aluno encontrado com o ID {id}."`         |

---

# Exemplo de requisição

## Cadastro de aluno

Método:

```bash
POST
```

URL:

```bash
http://localhost:3000/alunos/tabelaDeAlunos
```

Body:

```json
{
  "nome": "João Souza",
  "email": "joao@email.com",
  "curso": "UX Design",
  "nota": 7
}
```

---

# Observação

Os dados são armazenados apenas em memória. Isso significa que todas as informações cadastradas serão perdidas sempre que o servidor for reiniciado.

Esta abordagem foi utilizada para simplificar o desenvolvimento da aplicação e focar exclusivamente na estrutura da API e nas regras de negócio.
