# StalkerDeAluno 📋

**Sistema de Cadastro de Alunos**  
Projeto Acadêmico · Node.js + Express + React · ZanixCold — JovemTech

---

## 1. Visão Geral

O StalkerDeAluno é um sistema web completo para cadastro e gerenciamento de alunos. Foi desenvolvido como projeto acadêmico com foco em clareza de código, organização de pastas e aplicação dos conceitos de CRUD, validações e comunicação entre frontend e backend.

| Tipo | Projeto Acadêmico Full Stack (Frontend + Backend) |
|------|--------------------------------------------------|
| Backend | Node.js + Express — API REST |
| Banco | Array em memória (sem banco real — reinicia ao fechar) |
| Frontend | React + Vite |
| Roteamento | React Router v7 |
| Porta API | http://localhost:3000 |
| Porta Web | http://localhost:5173 |

---

## 2. Estrutura de Pastas

O projeto é dividido em duas pastas independentes: `backend` e `frontend`. Cada uma tem seu próprio `package.json` e precisa do `npm install` rodado separadamente.

```
stalkerdeAluno/
├── backend/
│   ├── index.js                    ← Ponto de entrada: sobe o servidor Express
│   ├── package.json                ← Dependências do backend
│   └── src/
│       ├── data/
│       │   └── alunos.js           ← "Banco de dados" (array em memória)
│       ├── controllers/
│       │   └── alunoController.js  ← Regras + validações de cada rota
│       └── router/
│           └── alunoRoutes.js      ← Mapeamento de rotas HTTP
│
└── frontend/
    ├── index.html                  ← HTML base que o Vite serve
    ├── package.json                ← Dependências do frontend
    ├── vite.config.js              ← Configuração do Vite
    └── src/
        ├── main.jsx                ← Ponto de entrada React
        ├── App.jsx                 ← Navbar + roteamento (React Router)
        ├── App.css                 ← Estilos da navbar e layout geral
        ├── index.css               ← Estilos globais das páginas
        ├── hooks/
        │   └── useAlunos.js        ← Hook personalizado (toda comunicação com a API)
        └── pages/
            ├── Gestao.jsx          ← Página CRUD completa
            └── Dashboard.jsx       ← Página de estatísticas
```

---

## 3. Como Rodar o Projeto

Você precisa de **dois terminais abertos** ao mesmo tempo: um para o backend e outro para o frontend.

### Terminal 1 — Backend

```bash
# Entre na pasta do backend
cd stalkerdeAluno/backend

# Instala as dependências (só na primeira vez)
npm install

# Inicia o servidor
npm run dev

# Resultado esperado:
# Servidor está on http://localhost:3000/alunos
```

### Terminal 2 — Frontend

```bash
# Entre na pasta do frontend
cd stalkerdeAluno/frontend

# Instala as dependências (só na primeira vez)
npm install

# Inicia a interface
npm run dev

# Resultado esperado:
#   VITE v8.x  ready
#   ➜  Local:   http://localhost:5173/
```

> ⚠️ **Importante:** sempre rode o backend primeiro. O frontend depende que a API esteja rodando para funcionar corretamente.

---

## 4. Rotas da API

Todas as rotas partem de `/alunos/tabelaDeAlunos`. O backend está rodando na porta `3000`.

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| `GET` | `/alunos/tabelaDeAlunos` | Retorna todos os alunos | 200 |
| `POST` | `/alunos/tabelaDeAlunos` | Cadastra um novo aluno | 201 |
| `PUT` | `/alunos/tabelaDeAlunos/:id` | Atualiza um aluno pelo ID | 200 |
| `DELETE` | `/alunos/tabelaDeAlunos/:id` | Remove um aluno pelo ID | 200 |

### Campos do Aluno (JSON)

Ao criar ou editar um aluno, envie os seguintes campos no corpo da requisição:

```json
{
  "nome":  "Ana Lima",       // string — obrigatório
  "email": "ana@email.com",  // string — obrigatório (formato validado)
  "curso": "Engenharia",     // string — obrigatório
  "nota":  9.5               // number entre 0 e 10 — opcional
}
```

---

## 5. Validações

O backend valida os dados antes de salvar qualquer coisa. Se a validação falhar, retorna um JSON com a chave `erro` e o código HTTP correspondente.

| # | Tipo | Regra | HTTP |
|---|------|-------|------|
| 1 | Campo obrigatório | `nome`, `email` e `curso` não podem ser vazios | `400` |
| 2 | Tamanho máximo | `nome` não pode ultrapassar 100 caracteres | `400` |
| 3 | Formato de e-mail | e-mail precisa ter `@`, domínio e extensão válidos (ex: `.com`) | `400` |
| 4 | Conflito (duplicata) | já existe aluno cadastrado com esse e-mail | `409` |
| 5 | Regra de negócio | `nota` deve ser um número entre 0 e 10 | `422` |
| 6 | Não encontrado | ID informado não existe (PUT/DELETE) | `404` |

### Como funciona a validação de e-mail

A validação de formato é feita **sem bibliotecas externas e sem consulta à internet**, usando apenas lógica com `split()` e `includes()`:

```js
function validarFormatoEmailBasico(email) {
  if (!email.includes('@')) return false;       // precisa ter @

  const partes = email.split('@');
  if (partes.length !== 2) return false;        // só um @ permitido

  const usuario = partes[0];
  const dominio = partes[1];

  if (usuario.length === 0) return false;        // parte antes do @ não pode ser vazia
  if (!dominio.includes('.')) return false;      // domínio precisa ter ponto

  const ultimoPedaco = dominio.split('.').at(-1);
  if (ultimoPedaco.length < 2) return false;    // extensão mínima: .co, .br, .com...

  return true;
}
```

Exemplos de como a validação se comporta:

| E-mail | Resultado |
|--------|-----------|
| `ana@email.com` | ✅ válido |
| `ana@` | ❌ domínio vazio |
| `anaemail.com` | ❌ sem @ |
| `ana@@email.com` | ❌ dois @ |
| `ana@email.c` | ❌ extensão muito curta |

### Exemplos de resposta de erro

```json
// Tentativa de cadastrar com nome vazio — Status: 400
{ "erro": "Nome, email e curso são obrigatórios." }

// E-mail com formato inválido — Status: 400
{ "erro": "O formato do e-mail informado é inválido." }

// E-mail já cadastrado — Status: 409
{ "erro": "Já existe um aluno cadastrado com esse e-mail." }

// Nota fora do intervalo — Status: 422
{ "erro": "A nota deve ser um valor entre 0 e 10." }
```

---

## 6. Explicação dos Arquivos — Backend

### `backend/index.js` — Ponto de entrada

É o primeiro arquivo que roda quando você executa `npm run dev`. Ele cria o servidor Express, registra os middlewares globais (`cors` e `json`) e conecta as rotas. É aqui que o servidor começa a escutar na porta 3000.

```js
import express from 'express';
import cors    from 'cors';
import alunoRouter from './src/router/alunoRoutes.js';

const servidor = express();

servidor.use(cors());          // Permite que o frontend acesse a API
servidor.use(express.json()); // Lê o corpo das requisições como JSON

servidor.use('/alunos', alunoRouter); // Delega /alunos para o router

servidor.listen(3000, () => {
  console.log('Servidor está on http://localhost:3000/alunos');
});
```

`cors()` é necessário porque o frontend (porta 5173) e o backend (porta 3000) são origens diferentes. Sem ele, o browser bloquearia as requisições.

---

### `backend/src/data/alunos.js` — O "banco de dados"

Simula um banco de dados usando um array simples. Toda vez que o servidor reinicia, os dados somem — esse é o comportamento esperado para um projeto acadêmico sem banco real.

O arquivo exporta funções que o controller usa para manipular os dados:

- `getAlunos()` → retorna todos os alunos
- `buscarAlunoPorId(id)` → retorna um aluno específico ou `undefined`
- `create(dados)` → adiciona aluno com ID automático
- `update(id, dados)` → substitui dados mantendo o ID
- `remove(id)` → retira aluno do array com `splice`, retorna `false` se o ID não existir

O ID é gerado pela variável `proximoIdDisponivel`, que começa em 1 e incrementa a cada aluno criado. Isso garante que nenhum aluno tenha o mesmo ID, mesmo que outros sejam deletados.

---

### `backend/src/controllers/alunoController.js` — As regras

É o arquivo mais importante do backend. Contém uma função para cada operação CRUD. Cada função recebe a requisição (`req`) com os dados enviados pelo cliente e devolve a resposta (`res`) com o resultado ou o erro.

O fluxo dentro de cada função segue sempre a mesma ordem:

1. Extrai os dados do corpo da requisição (`req.body`)
2. Valida os dados — se inválido, retorna erro imediatamente com `return`
3. Chama a função correspondente do `data/alunos.js`
4. Retorna o resultado com o status HTTP correto

```js
function criarNovoAluno(req, res) {
  const { nome, email, curso, nota } = req.body;

  // Validação 1 — campos obrigatórios (400)
  if (!nome || !email || !curso) {
    return res.status(400).json({ erro: 'Nome, email e curso são obrigatórios.' });
  }

  // Validação 2 — tamanho do nome (400)
  if (nome.length > 100) {
    return res.status(400).json({ erro: 'Nome não pode ter mais de 100 caracteres.' });
  }

  // Validação 3 — formato do e-mail (400)
  if (!validarFormatoEmailBasico(email)) {
    return res.status(400).json({ erro: 'O formato do e-mail informado é inválido.' });
  }

  // Validação 4 — e-mail duplicado (409)
  const emailJaExiste = BancoDeDados.getAlunos().some(
    aluno => aluno.email.toLowerCase() === email.toLowerCase()
  );
  if (emailJaExiste) {
    return res.status(409).json({ erro: 'Já existe um aluno cadastrado com esse e-mail.' });
  }

  // Validação 5 — nota fora do intervalo (422)
  if (nota !== undefined && (nota < 0 || nota > 10)) {
    return res.status(422).json({ erro: 'A nota deve ser um valor entre 0 e 10.' });
  }

  // Tudo ok — salva e retorna
  const novoAluno = BancoDeDados.create({ nome, email, curso, nota: Number(nota) });
  return res.status(201).json(novoAluno);
}
```

---

### `backend/src/router/alunoRoutes.js` — O mapa de rotas

Arquivo simples que conecta cada método HTTP (`GET`, `POST`, `PUT`, `DELETE`) à função correspondente do controller. Não contém lógica — só o mapeamento.

```js
alunoRouter.get('/tabelaDeAlunos',        CRUD.listarTodosAlunos)
alunoRouter.post('/tabelaDeAlunos',       CRUD.criarNovoAluno)
alunoRouter.put('/tabelaDeAlunos/:id',    CRUD.atualizarAlunoPorId)
alunoRouter.delete('/tabelaDeAlunos/:id', CRUD.deletarAlunoPorId)
```

O `:id` na rota é um parâmetro dinâmico. Quando a requisição chega, o Express preenche `req.params.id` com o valor real (ex: `/tabelaDeAlunos/3` → `req.params.id === '3'`). O controller converte para número com `parseInt()`.

---

## 7. Explicação dos Arquivos — Frontend

### `frontend/index.html` — Base HTML

Arquivo HTML único que o Vite serve. Só tem o necessário: uma `<div id="root">` onde o React vai ser injetado, e o script apontando para `main.jsx`. Você raramente vai editar esse arquivo.

---

### `frontend/src/main.jsx` — Ponto de entrada React

Inicializa o React e injeta o componente `App` dentro da `div#root` do `index.html`.

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

---

### `frontend/src/App.jsx` — Navbar + Roteamento

Configura as duas rotas da aplicação e renderiza a navbar em todas as páginas. A navbar usa `useLocation()` para detectar qual página está ativa e aplicar o estilo correto no link correspondente.

```jsx
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Gestao    from './pages/Gestao';
import Dashboard from './pages/Dashboard';

function NavBar() {
  const location = useLocation(); // detecta a rota atual

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span>🎓</span>
        <span>ZanixCold - Stalker de Alunos</span>
      </div>
      <div className="nav-links">
        <Link to="/"          className={location.pathname === '/'          ? 'nav-active' : ''}>📋 Gestão</Link>
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'nav-active' : ''}>📊 Dashboard</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main>
        <Routes>
          <Route path="/"          element={<Gestao />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <footer>ZanixCold © 2025 — JovemTech</footer>
    </BrowserRouter>
  );
}
```

---

### `frontend/src/hooks/useAlunos.js` — Hook personalizado

É o arquivo central do frontend. **Toda comunicação com o backend passa por aqui.** As páginas `Gestao.jsx` e `Dashboard.jsx` nunca fazem `fetch` diretamente — elas importam e usam as funções desse hook.

O hook expõe os seguintes estados e funções:

| Nome | Tipo | Descrição |
|------|------|-----------|
| `registros` | estado | array com todos os alunos vindos da API |
| `carregando` | estado | `true` enquanto aguarda resposta da API |
| `erro` | estado | mensagem de erro para mostrar na tela |
| `buscarAluno()` | função | `GET` — recarrega a lista do servidor |
| `criar(dados)` | função | `POST` — cadastra um novo aluno |
| `atualizar(id, dados)` | função | `PUT` — edita um aluno existente |
| `deletar(id)` | função | `DELETE` — remove um aluno pelo ID |

```js
const BASE_URL = 'http://localhost:3000/alunos/tabelaDeAlunos'

export function useAlunos() {
  const [registros,  setRegistros]  = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro,       setErro]       = useState('');

  const buscarAluno = async () => {
    setCarregando(true);
    try {
      const res   = await fetch(BASE_URL);
      const dados = await res.json();
      setRegistros(dados);
    } catch {
      setErro('Erro ao buscar registros');
    } finally {
      setCarregando(false); // sempre desativa o loading, mesmo se der erro
    }
  };

  useEffect(() => {
    buscarAluno(); // busca automaticamente ao abrir a página
  }, []);

  // ... criar, atualizar, deletar

  return { registros, carregando, erro, buscarAluno, criar, atualizar, deletar: deletarAluno };
}
```

**Por que usar um hook em vez de fetch direto nos componentes?**
Centralizar o fetch em um único lugar significa que se a URL da API mudar, você muda só aqui — não precisa caçar `fetch` espalhado por vários arquivos.

---

### `frontend/src/pages/Gestao.jsx` — Página CRUD

Página principal acessada em `/`. Usa o hook `useAlunos` para todas as operações. Antes de enviar ao backend, faz uma **validação local** no frontend para dar feedback imediato ao usuário sem precisar esperar uma resposta da API.

**Funcionalidades:**
- Formulário com campos `nome`, `email`, `curso` e `nota`
- Validação local antes do envio: nome obrigatório, `@` no e-mail, curso obrigatório, nota entre 0 e 10
- Verificação de duplicidade dupla: bloqueia cadastro se já existe aluno com mesmo `nome` **e** `email`
- Lista todos os alunos em tabela com badge colorido por nota (verde/amarelo/vermelho)
- Botão ✏️ preenche o formulário com os dados do aluno para edição
- Botão 🗑️ remove o aluno diretamente
- Mensagem de erro exibida na tela em caso de falha

**Lógica das cores de nota:**

| Nota | Cor | Classe CSS |
|------|-----|-----------|
| ≥ 7.0 | 🟢 Verde | `nota-alta` |
| 5.0 – 6.9 | 🟡 Amarelo | `nota-media` |
| < 5.0 | 🔴 Vermelho | `nota-baixa` |

---

### `frontend/src/pages/Dashboard.jsx` — Estatísticas

Página acessada em `/dashboard`. Lê os dados do hook `useAlunos` e calcula todas as estatísticas localmente, sem nenhuma rota extra no backend.

**O que exibe:**

| Seção | Conteúdo |
|-------|----------|
| Cards de resumo | Total de alunos, média da turma, melhor aluno |
| Top 3 | Pódio 🥇🥈🥉 com os três maiores notas |
| Situação da turma | Barras de progresso de aprovados / recuperação / reprovados |
| Notas extremas | Menor nota, média e maior nota lado a lado |
| Desempenho individual | Gráfico de barras horizontais para cada aluno, ordenado por nota |

**Critérios de classificação:**

| Situação | Critério |
|----------|----------|
| ✅ Aprovado | nota ≥ 7.0 |
| ⚠️ Recuperação | nota entre 5.0 e 6.9 |
| ❌ Reprovado | nota < 5.0 |

Se não houver nenhum aluno cadastrado, a página exibe um estado vazio orientando o usuário a cadastrar alunos na página de Gestão.

---

### `frontend/src/index.css` e `frontend/src/App.css` — Estilos

- `index.css` → estilos globais das páginas (tabelas, formulários, cards, badges de nota, gráfico de barras)
- `App.css` → estilos específicos da navbar, layout geral e footer

---

### `frontend/vite.config.js` — Configuração do Vite

Arquivo de configuração do Vite. Registra o plugin do React. Você normalmente não precisa editar esse arquivo.

---

## 8. Erros Comuns e Como Resolver

| Erro | Causa | Solução |
|------|-------|---------|
| `'vite' não é reconhecido como comando interno` | `npm install` não foi rodado dentro de `frontend/` | `cd frontend` → `npm install` → `npm run dev` |
| `Invalid hook call / two copies of React` | `npm install` foi rodado na pasta raiz do projeto | Apagar `node_modules` da raiz: `rm -rf node_modules` |
| `ERR_CONNECTION_REFUSED` no fetch | Backend não está rodando | Abra outro terminal: `cd backend` → `npm run dev` |
| `CORS error` no console do browser | O servidor não tem o middleware `cors()` ativo | Confirmar que `servidor.use(cors())` está no `index.js` |
| Dados somem ao reiniciar o servidor | Comportamento esperado — banco é um array em memória | Normal para este projeto. Para persistir dados, seria necessário um banco real |

---

## 9. Resumo do que está pronto

| Parte | Status |
|-------|--------|
| Backend — rotas CRUD completas | ✅ Pronto |
| Backend — validações (6 tipos) | ✅ Pronto |
| Backend — validação de formato de e-mail | ✅ Pronto |
| Frontend — hook `useAlunos` | ✅ Pronto |
| Frontend — página Gestão (formulário + lista) | ✅ Pronto |
| Frontend — página Dashboard (estatísticas + gráfico) | ✅ Pronto |
| Frontend — navbar com rotas ativas | ✅ Pronto |

---

*StalkerDeAluno · Documentação do Projeto · ZanixCold — JovemTech*
