# StalkerDeAluno — Frontend

---

# Tecnologias utilizadas

* React — biblioteca para construção da interface
* Vite — ferramenta de desenvolvimento e build
* React Router DOM — navegação entre páginas
* CSS customizado — estilização da aplicação

---

# Estrutura do projeto

```
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── App.css
    ├── main.jsx
    ├── hooks/
    │   └── useAlunos.js
    └── pages/
        ├── Gestao.jsx
        └── Dashboard.jsx
```

## Organização das pastas

| Pasta/Arquivo | Responsabilidade |
| -------------- | ---------------- |
| `src/App.jsx` | Configuração das rotas e navegação principal |
| `src/pages/Gestao.jsx` | Cadastro, edição e exclusão de alunos |
| `src/pages/Dashboard.jsx` | Visualização de métricas e desempenho |
| `src/hooks/useAlunos.js` | Requisições para a API do backend |

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

## Inicializando a aplicação

```bash
npm run dev
```

A aplicação ficará disponível em:

```bash
http://localhost:5173
```

---

# Funcionalidades

## Página de Gestão

* Cadastrar novos alunos
* Editar registros existentes
* Excluir alunos
* Exibir lista com nome, e-mail, curso e nota

## Página de Dashboard

* Total de alunos
* Média da turma
* Melhor aluno
* Top 3 da turma
* Situação da turma (aprovados, recuperação e reprovados)
* Gráfico de desempenho individual

---

# Integração com o backend

O frontend consome a API disponível em:

```bash
http://localhost:3000/alunos/tabelaDeAlunos
```

Se o backend não estiver em execução, a interface pode exibir mensagens de erro ao tentar carregar ou salvar dados.

---

# Comandos úteis

```bash
npm run dev      # inicia o servidor de desenvolvimento
npm run build    # gera a versão de produção
npm run lint     # verifica problemas no código
npm run preview  # visualiza a build localmente
```

---

# Observação

Esta interface foi desenvolvida para trabalhar em conjunto com o backend do projeto StalkerDeAluno.
