# StalkerDeAluno — Frontend

---

# Tecnologias utilizadas

* React — biblioteca para construção de interfaces
* Vite — bundler e servidor de desenvolvimento
* React Router DOM — gerenciamento de rotas/navegação
* JavaScript (ES6+) — linguagem base do projeto

---

# Estrutura do projeto

```
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── hooks/
    │   └── useAlunos.js
    └── pages/
        ├── Dashboard.jsx
        └── Gestao.jsx
```

## Organização das pastas

| Pasta/Arquivo  | Responsabilidade                                                  |
| -------------- | ----------------------------------------------------------------- |
| `main.jsx`     | Ponto de entrada da aplicação React                               |
| `App.jsx`      | Componente raiz com definição de rotas e layout geral             |
| `App.css`      | Estilização global da aplicação                                   |
| `hooks/`       | Hook customizado que encapsula as chamadas à API de alunos        |
| `pages/`       | Páginas da aplicação (Dashboard e Gestão)                         |

---

# Páginas da aplicação

| Página          | Rota         | Descrição                                                        |
| --------------- | ------------ | ---------------------------------------------------------------- |
| **Dashboard**   | `/`          | Visão geral da turma com cards, ranking top 3, situação e gráfico |
| **Gestão**      | `/gestao`    | CRUD completo de alunos — cadastrar, editar e deletar            |

---

# Como executar o projeto

## Pré-requisitos

* Node.js v18 ou superior
* npm instalado
* Backend rodando em `http://localhost:3000`

---

## Instalação das dependências

Dentro da pasta `frontend/`, execute:

```bash
npm install
```

---

## Inicializando o servidor de desenvolvimento

```bash
npm run dev
```

Aplicação disponível em:

```bash
http://localhost:5173
```

---

# Hook useAlunos

Hook customizado que centraliza toda a comunicação com a API do backend.

| Retorno       | Tipo       | Descrição                                  |
| ------------- | ---------- | ------------------------------------------ |
| `registros`   | array      | Lista de alunos retornada pela API         |
| `carregando`  | boolean    | Indica se a requisição ainda está em curso |
| `erro`        | string     | Mensagem de erro vinda do backend          |
| `criar`       | function   | Cadastra um novo aluno                     |
| `atualizar`   | function   | Atualiza um aluno existente pelo ID        |
| `deletar`     | function   | Remove um aluno pelo ID                    |

---

# Estrutura dos dados utilizados

## Campos do formulário (Gestão)

| Campo  | Tipo   | Obrigatório | Regras                   |
| ------ | ------ | ----------- | ------------------------ |
| `nome` | string | Sim         | Máximo de 100 caracteres |
| `nota` | number | Sim         | Valor entre 0 e 10       |

---

# Validações no frontend

A página de Gestão faz validações antes de enviar os dados pro backend, pra dar um feedback mais rápido pro usuário.

| Situação                         | Mensagem exibida                                  |
| -------------------------------- | ------------------------------------------------- |
| Nome vazio                       | `"O nome é obrigatório."`                         |
| Nome acima de 100 caracteres     | `"O nome deve ter no máximo 100 caracteres."`     |
| Nota vazia, inválida ou fora do range | `"A nota deve ser um número entre 0 e 10."`  |

---

# Funcionalidades

## Dashboard

* Card com total de alunos
* Card com média geral da turma
* Card com o melhor aluno (maior nota)
* Ranking top 3 alunos com medalhas
* Barras de situação: aprovados (≥ 7), recuperação (5–6.9) e reprovados (< 5)
* Exibição de menor nota, média e maior nota
* Gráfico de barras com desempenho individual de cada aluno

## Gestão

* Formulário de cadastro e edição de alunos
* Tabela com listagem de todos os alunos
* Badge colorido na nota (verde, amarelo, vermelho)
* Botões de editar e deletar por aluno
* Confirmação antes de deletar
* Feedback visual de loading e estados vazios

---

# Observação

O frontend depende do backend estar rodando para funcionar corretamente. Todas as operações de leitura e escrita passam pela API.

A validação existe tanto no frontend (UX) quanto no backend (segurança) — isso é intencional.