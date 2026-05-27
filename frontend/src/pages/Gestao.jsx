import { useState } from 'react';
import { useAlunos } from '../hooks/useAlunos';

export default function Gestao() {
  // Hook customizado que encapsula as chamadas à API de alunos
  const { registros, carregando, erro, criar, atualizar, deletar } = useAlunos();

  // Estado do formulário (serve tanto pra criar quanto pra editar)
  const [form, setForm] = useState({ nome: '', idade: '', nota: '' });
  const [editandoId, setEditandoId] = useState(null); // null = modo criação, com ID = modo edição
  const [erroLocal, setErroLocal] = useState(''); // Erros de validação do front

  // Atualiza o campo correspondente no state do form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validação antes de enviar pro backend — feedback rápido pro usuário
  const validarFrontend = () => {
    if (!form.nome.trim()) {
      setErroLocal('O nome é obrigatório.');
      return false;
    }
    if (form.nome.trim().length > 100) {
      setErroLocal('O nome deve ter no máximo 100 caracteres.');
      return false;
    }
    const idade = Number(form.idade);
    if (!form.idade || isNaN(idade) || idade < 1 || idade > 130 || !Number.isInteger(idade)) {
      setErroLocal('Idade deve ser um número inteiro entre 1 e 130.');
      return false;
    }
    const nota = Number(form.nota);
    if (form.nota === '' || isNaN(nota) || nota < 0 || nota > 10) {
      setErroLocal('A nota deve ser um número entre 0 e 10.');
      return false;
    }
    setErroLocal('');
    return true;
  };

  // Submit — decide se cria ou atualiza com base no editandoId
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroLocal('');
    if (!validarFrontend()) return;

    const payload = {
      nome: form.nome.trim(),
      idade: Number(form.idade),
      nota: Number(form.nota),
    };

    try {
      if (editandoId) {
        await atualizar(editandoId, payload);
      } else {
        await criar(payload);
      }
      setForm({ nome: '', idade: '', nota: '' });
      setEditandoId(null);
    } catch (err) {
      setErroLocal(err.message || 'Erro ao salvar aluno.');
    }
  };

  // Preenche o form com os dados do aluno selecionado pra edição
  const handleEditar = (aluno) => {
    setForm({ nome: aluno.nome, idade: String(aluno.idade), nota: String(aluno.nota) });
    setEditandoId(aluno.id);
    setErroLocal('');
  };

  // Reseta o form e sai do modo edição
  const handleCancelar = () => {
    setForm({ nome: '', idade: '', nota: '' });
    setEditandoId(null);
    setErroLocal('');
  };

  // Deleta com confirmação — se tava editando o mesmo aluno, cancela a edição
  const handleDeletar = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja remover "${nome}"?`)) {
      try {
        await deletar(id);
        if (editandoId === id) handleCancelar();
      } catch (err) {
        setErroLocal(err.message || 'Erro ao deletar aluno.');
      }
    }
  };

  // Retorna a classe CSS conforme faixa da nota (verde, amarelo, vermelho)
  const getNotaClass = (nota) => {
    if (nota >= 7) return 'nota-alta';
    if (nota >= 5) return 'nota-media';
    return 'nota-baixa';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📋 Gestão de Alunos</h1>
        <p className="subtitle">Cadastre, edite e gerencie os alunos da turma</p>
      </div>

      {/* Alerta de erro — mostra erro do backend OU do front */}
      {(erro || erroLocal) && (
        <div className="alerta-erro">
          <span>⚠️ {erroLocal || erro}</span>
          <button onClick={() => setErroLocal('')} className="btn-fechar-alerta">✕</button>
        </div>
      )}

      <div className="gestao-layout">
        {/* ===== FORMULÁRIO (criar / editar) ===== */}
        <div className="form-card">
          <h2>{editandoId ? '✏️ Editar Aluno' : '➕ Novo Aluno'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Nome completo do aluno"
                value={form.nome}
                onChange={handleChange}
                maxLength={100}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="idade">Idade</label>
                <input
                  type="number"
                  id="idade"
                  name="idade"
                  placeholder="Ex: 18"
                  value={form.idade}
                  onChange={handleChange}
                  min="1"
                  max="130"
                />
              </div>
              <div className="form-group">
                <label htmlFor="nota">Nota</label>
                <input
                  type="number"
                  id="nota"
                  name="nota"
                  placeholder="0 a 10"
                  value={form.nota}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editandoId ? '💾 Salvar Alterações' : '✅ Cadastrar'}
              </button>
              {editandoId && (
                <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ===== LISTA DE ALUNOS ===== */}
        <div className="lista-card">
          <h2>📚 Lista de Alunos ({registros.length})</h2>
          {carregando ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Carregando alunos...</p>
            </div>
          ) : registros.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎓</span>
              <p>Nenhum aluno cadastrado ainda.</p>
              <p className="empty-hint">Use o formulário ao lado para começar!</p>
            </div>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela-alunos">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th>Nota</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((aluno) => (
                    <tr key={aluno.id} className={editandoId === aluno.id ? 'row-editando' : ''}>
                      <td className="td-nome">{aluno.nome}</td>
                      <td className="td-center">{aluno.idade} anos</td>
                      <td className="td-center">
                        <span className={`badge-nota ${getNotaClass(Number(aluno.nota))}`}>
                          {Number(aluno.nota).toFixed(1)}
                        </span>
                      </td>
                      <td className="td-acoes">
                        <button className="btn btn-edit" onClick={() => handleEditar(aluno)} title="Editar">✏️</button>
                        <button className="btn btn-delete" onClick={() => handleDeletar(aluno.id, aluno.nome)} title="Deletar">🗑️</button>
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