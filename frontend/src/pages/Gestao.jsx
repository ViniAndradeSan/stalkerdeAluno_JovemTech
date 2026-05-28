import { useState } from 'react';
import { useAlunos } from '../hooks/useAlunos';

export default function Gestao() {
  // Chamando as funções do hook que minha amiga criou
  const { registros, carregando, erro, criar, atualizar, deletar } = useAlunos();

  // Meu estado do formulário com todos os campos necessários
  const [form, setForm] = useState({ 
    nome: '', 
    nota: '',
    email: '',
    curso: ''
  });
  
  const [editandoId, setEditandoId] = useState(null);
  const [erroLocal, setErroLocal] = useState('');

  // Função para lidar com as mudanças nos campos de texto
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Função para validar se os campos estão preenchidos antes de enviar ao backend
  const validarFormulario = () => {
    if (!form.nome.trim()) { setErroLocal('Nome é obrigatório.'); return false; }
    if (!form.email.includes('@')) { setErroLocal('E-mail inválido.'); return false; }
    if (!form.curso.trim()) { setErroLocal('Diga qual o curso.'); return false; }
    if (form.nota === '' || form.nota < 0 || form.nota > 10) { setErroLocal('Nota deve ser entre 0 e 10.'); return false; }
    
    setErroLocal('');
    return true;
  };

  // Função que envia os dados para o banco de dados
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    // Verifica se já existe um aluno com o exato mesmo Nome e Email (Duplicidade Dupla)
    const alunoDuplicado = registros.find(aluno => 
        aluno.nome.toLowerCase() === form.nome.toLowerCase() && 
        aluno.email.toLowerCase() === form.email.toLowerCase()
    );
    // Se encontramos alguém com esses mesmos dados e não é o aluno que estamos editando
    if (alunoDuplicado && alunoDuplicado.id !== editandoId) {
        setErroLocal('Já existe um registro idêntico (Nome e E-mail) para este aluno.');
        return;
    }

    const dadosParaEnviar = {
      nome: form.nome,
      nota: Number(form.nota),
      email: form.email,
      curso: form.curso
    };

    try {
      if (editandoId) {
        await atualizar(editandoId, dadosParaEnviar);
      } else {
        await criar(dadosParaEnviar);
      }
      handleCancelar(); // Limpa o formulário após sucesso
    } catch (err) {
      setErroLocal(err.message || 'Erro ao processar.');
    }
  };

  // Preenche o formulário para edição
  const handleEditar = (aluno) => {
    setForm({ 
      nome: aluno.nome, 
      nota: String(aluno.nota),
      email: aluno.email || '',
      curso: aluno.curso || ''
    });
    setEditandoId(aluno.id);
  };

  // Cancela a edição e limpa campos
  const handleCancelar = () => {
    setForm({ nome: '', nota: '', email: '', curso: '' });
    setEditandoId(null);
    setErroLocal('');
  };

  // Função para definir a cor da nota (Verde, Amarelo ou Vermelho)
  const definirCorNota = (nota) => {
    if (nota >= 7) return 'nota-alta'; // Verde
    if (nota >= 5) return 'nota-media'; // Amarelo
    return 'nota-baixa'; // Vermelho
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📋 Gestão de Alunos</h1>
        <p className="subtitle">Administração completa da turma</p>
      </div>

      {(erro || erroLocal) && (
        <div className="alerta-erro">
          <span>⚠️ {erroLocal || erro}</span>
        </div>
      )}

      <div className="gestao-layout">
        {/* Formulário de Cadastro/Edição */}
        <div className="form-card">
          <h2>{editandoId ? '✏️ Editar Registro' : '➕ Novo Cadastro'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome do Aluno</label>
              <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" />
            </div>

            <div className="form-group">
              <label>E-mail Acadêmico</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="exemplo@email.com" />
            </div>

            <div className="form-group">
              <label>Curso / Matéria</label>
              <input type="text" name="curso" value={form.curso} onChange={handleChange} placeholder="Ex: Informática" />
            </div>

            <div className="form-row">
              
              <div className="form-group">
                <label>Nota Final</label>
                <input type="number" name="nota" step="0.1" value={form.nota} onChange={handleChange} />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editandoId ? 'Atualizar Dados' : 'Salvar Aluno'}
              </button>
              {editandoId && <button type="button" className="btn btn-secondary" onClick={handleCancelar}>Cancelar</button>}
            </div>
          </form>
        </div>

        {/* Listagem dos Dados */}
        <div className="lista-card">
          <h2>📚 Alunos Matriculados ({registros.length})</h2>
          {carregando ? <div className="spinner"></div> : (
            <div className="tabela-wrapper">
              <table className="tabela-alunos">
                <thead>
                  <tr>
                    <th>Informações do Aluno</th>
                    <th>Curso</th>
                    <th>Nota</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((aluno) => (
                    <tr key={aluno.id} className={editandoId === aluno.id ? 'row-editando' : ''}>
                      <td>
                        <div className="td-nome">{aluno.nome}</div>
                        <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>
                           {aluno.email}
                        </div>
                      </td>
                      <td>{aluno.curso}</td>
                      <td>
                        <span className={`badge-nota ${definirCorNota(Number(aluno.nota))}`}>
                          {Number(aluno.nota).toFixed(1)}
                        </span>
                      </td>
                      <td className="td-acoes">
                        <button className="btn-edit" onClick={() => handleEditar(aluno)}>✏️</button>
                        <button className="btn-delete" onClick={() => deletar(aluno.id, aluno.nome)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}