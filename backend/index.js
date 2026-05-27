import express from 'express';
import cors from 'cors';
import alunoRouter from './src/router/alunoRoutes.js';

const servidor = express()

//─────────────────────────────────────────────────────
// Rodar toda a requisição antes de chegar nas rotas
//─────────────────────────────────────────────────────
servidor.use(cors())
servidor.use(express.json())

servidor.use('/alunos', alunoRouter);

servidor.listen(3000, () =>{
    console.log('Servidor está on http://localhost:3000/alunos')
}) 

