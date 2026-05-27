/* Configuração principal da aplicação com rotas,
   navegação entre páginas e estrutura global do sistema */

import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Gestao from './pages/Gestao';
import Dashboard from './pages/Dashboard';
import './App.css';

function NavBar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-logo">🎓</span>
        <span className="nav-title">ZanixCold -Stalker de Alunos</span>
      </div>

      <div className="nav-links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'nav-active' : ''}`}
        >
          📋 Gestão
        </Link>

        <Link
          to="/dashboard"
          className={`nav-link ${location.pathname === '/dashboard' ? 'nav-active' : ''}`}
        >
          📊 Dashboard
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Gestao />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>ZanixCold © 2025 — JovemTech </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;