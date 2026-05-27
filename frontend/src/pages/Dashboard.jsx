
import { useAlunos } from '../hooks/useAlunos';

export default function Dashboard() {
  // Puxando os registros reais do banco de dados através do hook
  const { registros, carregando, erro } = useAlunos();

  // Cálculos de estatísticas baseados nos dados recebidos
  const totalAlunos = registros.length;
  const mediaTurma = totalAlunos > 0 ? registros.reduce((acc, a) => acc + Number(a.nota), 0) / totalAlunos : 0;
  
  // Encontrando o aluno com a maior nota
  const melhorAluno = totalAlunos > 0 ? registros.reduce((prev, current) => (Number(prev.nota) > Number(current.nota)) ? prev : current) : null;

  // Renderizando o carregamento ou erro caso existam
  if (carregando) return <div className="loading"><div className="spinner"></div></div>;
  if (erro) return <div className="alerta-erro">⚠️ {erro}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Estatísticas da Turma</h1>
        <p className="subtitle">Visão geral do desempenho escolar</p>
      </div>

      {totalAlunos === 0 ? (
        <p>Aguardando cadastro de alunos para gerar o gráfico...</p>
      ) : (
        <>
          <div className="dashboard-cards">
            {/* Card de Total */}
            <div className="dash-card card-total">
               <span className="dash-card-value">{totalAlunos}</span>
               <span className="dash-card-label">Alunos Ativos</span>
            </div>

            {/* Card de Média */}
            <div className="dash-card card-media">
               <span className="dash-card-value">{mediaTurma.toFixed(1)}</span>
               <span className="dash-card-label">Média Geral</span>
            </div>

            {/* Card do Melhor Aluno */}
            <div className="dash-card card-melhor">
               <span className="dash-card-value" style={{fontSize: '1.2rem'}}>{melhorAluno?.nome}</span>
               <span className="dash-card-label">Destaque da Turma</span>
            </div>
          </div>

          <div className="dash-section">
            <h2>📈 Gráfico de Notas</h2>
            <div className="grafico-barras">
              {registros.map(aluno => (
                <div key={aluno.id} className="grafico-item">
                  <span className="grafico-nome">{aluno.nome}</span>
                  <div className="grafico-barra-container">
                    <div 
                      className="grafico-barra-fill" 
                      style={{ 
                        width: `${(aluno.nota / 10) * 100}%`,
                        backgroundColor: aluno.nota >= 7 ? '#10b981' : aluno.nota >= 5 ? '#f59e0b' : '#ef4444'
                      }}
                    >
                      <span className="grafico-nota-label">{aluno.nota}</span>
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