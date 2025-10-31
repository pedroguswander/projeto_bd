import React, { useState } from 'react';
import './Home.css';
import {
  FaFilm, FaUsers, FaUserCog, FaTags, FaSearch,
  FaUserCircle, FaChartBar, FaChevronDown
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import SatisfacaoChart from '../components/SatisfacaoChart';
import { DistribuicaoHorasSemanaisChart } from '../components/DistribuicaoHorasSemanaisChart';
import GeneroPorAssistidoChart from '../components/GeneroPorAssistidoChart';
import InserirUsuario from '../components/InserirUsuario';

function Home() {
  const [openMenu, setOpenMenu] = useState(null);
  const [isUsuarioModalOpen, setUsuarioModalOpen] = useState(false);

  const handleMenuClick = (menuKey) => {
    setOpenMenu(openMenu === menuKey ? null : menuKey);
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">

        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="sidebar-logo">StreamAnalytics</div>
          <ul className="sidebar-menu">
            <li className="menu-header">Menu</li>
            <li className="menu-item active">
              <div className="menu-item-content">
                <FaChartBar /> Dashboard
              </div>
            </li>

            <li className="menu-header">Gerenciar Entidades</li>

            {/* Usuários */}
            <li className={`menu-item-dropdown ${openMenu === 'usuarios' ? 'open' : ''}`}>
              <div className="menu-item" onClick={() => handleMenuClick('usuarios')}>
                <div className="menu-item-content">
                  <FaUserCog /> Gerenciar Usuários
                </div>
                <FaChevronDown className="dropdown-icon" />
              </div>
              <ul className="submenu">
                <li><a onClick={() => setUsuarioModalOpen(true)}>Adicionar</a></li>
                <li><Link to="/usuarios/atualizar">Atualizar</Link></li>
                <li><Link to="/usuarios/deletar">Deletar</Link></li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="main-content">
          <header className="dashboard-header">
            <div className="search-bar">
              <FaSearch color="#aaa" />
              <input type="text" placeholder="Procurar..." />
            </div>
            <div className="user-profile">
              <FaUserCircle size={24} />
              <span>Admin User</span>
            </div>
          </header>

          <h1>Dashboard</h1>

          <section className="dashboard-grid">
            <div className="dashboard-card card-medium">
              <SatisfacaoChart />
            </div>

            <div className="dashboard-card card-large">
              <GeneroPorAssistidoChart />
            </div>

            <div className="dashboard-card card-medium">
              <DistribuicaoHorasSemanaisChart />
            </div>

            <div className="dashboard-card card-medium">
              <h3>Conteúdo Mais Visto</h3>
              <ul className="top-content-list">
                <li><span>1. A Origem da Matrix</span> <span>1.2M views</span></li>
                <li><span>2. Conexões Perdidas</span> <span>980K views</span></li>
                <li><span>3. O Último Horizonte</span> <span>750K views</span></li>
                <li><span>4. Crônicas de Neon</span> <span>610K views</span></li>
              </ul>
            </div>
          </section>
        </main>
      </div>

      {/* MODAIS */}
      {isUsuarioModalOpen && <InserirUsuario onClose={() => setUsuarioModalOpen(false)} />}
    </div>
  );
}

export default Home;
