
import { useAlunos } from '../hooks/useAlunos';

export default function Dashboard() {
  const { registros, carregando, erro } = useAlunos();

  const totalAlunos = registros.length;

  const mediaTurma =
    totalAlunos > 0
      ? registros.reduce((acc, a) => acc + Number(a.nota), 0) / totalAlunos
      : 0;

  const melhorAluno =
    totalAlunos > 0
      ? registros.reduce((best, a) => (Number(a.nota) > Number(best.nota) ? a : best), registros[0])
      : null;

  const top3 = [...registros].sort((a, b) => Number(b.nota) - Number(a.nota)).slice(0, 3);

  const aprovados = registros.filter((a) => Number(a.nota) >= 7).length;
  const recuperacao = registros.filter((a) => Number(a.nota) >= 5 && Number(a.nota) < 7).length;
  const reprovados = registros.filter((a) => Number(a.nota) < 5).length;

  const mediaIdade =
    totalAlunos > 0
      ? registros.reduce((acc, a) => acc + Number(a.idade), 0) / totalAlunos
      : 0;

  const maiorNota = totalAlunos > 0 ? Math.max(...registros.map((a) => Number(a.nota))) : 0;
  const menorNota = totalAlunos > 0 ? Math.min(...registros.map((a) => Number(a.nota))) : 0;

  const getBarWidth = (nota) => {
    return `${(Number(nota) / 10) * 100}%`;
  };

  const getBarColor = (nota) => {
    const n = Number(nota);
    if (n >= 7) return '#10b981';
    if (n >= 5) return '#f59e0b';
    return '#ef4444';
  };

  const getMedalha = (index) => {
    const medalhas = ['🥇', '🥈', '🥉'];
    return medalhas[index] || '';
  };

  if (carregando) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="page-container">
        <div className="alerta-erro">
          <span>⚠️ {erro}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Dashboard da Turma</h1>
        <p className="subtitle">Visão geral do desempenho dos alunos</p>
      </div>

      {totalAlunos === 0 ? (
        <div className="empty-state dashboard-empty">
          <span className="empty-icon">📭</span>
          <p>Nenhum dado disponível.</p>
          <p className="empty-hint">Cadastre alunos na página de Gestão para ver as estatísticas!</p>
        </div>
      ) : (
        <>
          {/* Cards de Resumo */}
          <div className="dashboard-cards">
            <div className="dash-card card-total">
              <div className="dash-card-icon">👥</div>
              <div className="dash-card-info">
                <span className="dash-card-value">{totalAlunos}</span>
                <span className="dash-card-label">Total de Alunos</span>
              </div>
            </div>

            <div className="dash-card card-media">
              <div className="dash-card-icon">📈</div>
              <div className="dash-card-info">
                <span className="dash-card-value">{mediaTurma.toFixed(1)}</span>
                <span className="dash-card-label">Média da Turma</span>
              </div>
            </div>

            <div className="dash-card card-melhor">
              <div className="dash-card-icon">⭐</div>
              <div className="dash-card-info">
                <span className="dash-card-value" style={{fontSize: '1.2rem'}}>{melhorAluno?.nome}</span>
                <span className="dash-card-label">Melhor Aluno — Nota {Number(melhorAluno?.nota).toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Seção intermediária */}
          <div className="dashboard-mid">
            {/* Top 3 Alunos */}
            <div className="dash-section top3-section">
              <h2>🏆 Top 3 Alunos</h2>
              <div className="top3-list">
                {top3.map((aluno, i) => (
                  <div key={aluno.id} className={`top3-item top3-${i + 1}`}>
                    <div className="top3-rank">
                      <span className="medalha">{getMedalha(i)}</span>
                      <span className="top3-pos">#{i + 1}</span>
                    </div>
                    <div className="top3-info">
                      <span className="top3-nome">{aluno.nome}</span>
                      <span className="top3-idade">{aluno.curso || 'Ensino Geral'}</span>
                    </div>
                    <div className="top3-nota">
                      <span className="top3-nota-valor">{Number(aluno.nota).toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Situação da Turma */}
            <div className="dash-section situacao-section">
              <h2>📋 Situação da Turma</h2>
              <div className="situacao-grid">
                <div className="situacao-item aprovados">
                  <div className="situacao-barra">
                    <div
                      className="situacao-fill aprovados-fill"
                      style={{ width: `${totalAlunos > 0 ? (aprovados / totalAlunos) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="situacao-info">
                    <span className="situacao-emoji">✅</span>
                    <span className="situacao-label">Aprovados (≥ 7.0)</span>
                    <span className="situacao-count">{aprovados}</span>
                  </div>
                </div>
                <div className="situacao-item recuperacao">
                  <div className="situacao-barra">
                    <div
                      className="situacao-fill recuperacao-fill"
                      style={{ width: `${totalAlunos > 0 ? (recuperacao / totalAlunos) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="situacao-info">
                    <span className="situacao-emoji">⚠️</span>
                    <span className="situacao-label">Recuperação (5.0–6.9)</span>
                    <span className="situacao-count">{recuperacao}</span>
                  </div>
                </div>
                <div className="situacao-item reprovados">
                  <div className="situacao-barra">
                    <div
                      className="situacao-fill reprovados-fill"
                      style={{ width: `${totalAlunos > 0 ? (reprovados / totalAlunos) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="situacao-info">
                    <span className="situacao-emoji">❌</span>
                    <span className="situacao-label">Reprovados (&lt; 5.0)</span>
                    <span className="situacao-count">{reprovados}</span>
                  </div>
                </div>
              </div>

              <div className="notas-range">
                <div className="range-item">
                  <span className="range-label">📉 Menor nota</span>
                  <span className="range-value">{menorNota.toFixed(1)}</span>
                </div>
                <div className="range-item">
                  <span className="range-label">📊 Média</span>
                  <span className="range-value">{mediaTurma.toFixed(1)}</span>
                </div>
                <div className="range-item">
                  <span className="range-label">📈 Maior nota</span>
                  <span className="range-value">{maiorNota.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de barras de todos os alunos */}
          <div className="dash-section grafico-section">
            <h2>📊 Desempenho Individual</h2>
            <div className="grafico-barras">
              {[...registros].sort((a, b) => Number(b.nota) - Number(a.nota)).map((aluno) => (
                <div key={aluno.id} className="grafico-item">
                  <span className="grafico-nome">{aluno.nome}</span>
                  <div className="grafico-barra-container">
                    <div
                      className="grafico-barra-fill"
                      style={{
                        width: getBarWidth(aluno.nota),
                        backgroundColor: getBarColor(aluno.nota),
                      }}
                    >
                      <span className="grafico-nota-label">{Number(aluno.nota).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}