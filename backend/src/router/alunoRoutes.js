import router from 'express'
import * as CRUD from '../controllers/alunoController.js'

const alunoRouter = router()

// ─────────────────────────────────────────
// Rotas de ações para alunos
// Cada linha relaciona o metodo http com a rota da função controller
// ─────────────────────────────────────────
alunoRouter.get('/tabelaDeAlunos', CRUD.listarTodosAlunos)
alunoRouter.post('/tabelaDeAlunos', CRUD.criarNovoAluno)
alunoRouter.delete('/tabelaDeAlunos/:id', CRUD.deletarAlunoPorId)
alunoRouter.put('/tabelaDeAlunos/:id', CRUD.atualizarAlunoPorId)

export default alunoRouter