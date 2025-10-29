// Adicione 'useState' na importação do React
import React, { useState } from 'react';
import './Home.css';
import {
  FaFilm, FaUsers, FaUserCog, FaTags, FaSearch,
  FaUserCircle, FaChartBar, FaChevronDown
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import SatisfacaoChart from '../components/SatisfacaoChart';
import InserirUsuario from '../components/InserirUsuario';
import InserirObra from '../components/InserirUsuario';
import InserirConta from '../components/InserirUsuario';
import InserirGenero from '../components/InserirUsuario';

function Home() {
  // Estado para controlar o menu dropdown
  const [openMenu, setOpenMenu] = useState(null);

  // Estados para controlar cada modal
  const [isUsuarioModalOpen, setUsuarioModalOpen] = useState(false);
  const [isObraModalOpen, setObraModalOpen] = useState(false);
  const [isContaModalOpen, setContaModalOpen] = useState(false);
  const [isGeneroModalOpen, setGeneroModalOpen] = useState(false);

  const handleMenuClick = (menuKey) => {
    setOpenMenu(openMenu === menuKey ? null : menuKey);
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">

        {/* ================================== */}
        {/* 1. SIDEBAR (MENU LATERAL) */}
        {/* ================================== */}
        <nav className="sidebar">
          <div className="sidebar-logo">
            StreamAnalytics
          </div>

          <ul className="sidebar-menu">
            <li className="menu-header">Menu</li>
            <li className="menu-item active">
              <div className="menu-item-content">
                <FaChartBar /> Dashboard
              </div>
            </li>

            <li className="menu-header">Gerenciar Entidades</li>

            {/* Dropdown: Obras */}
            <li className={`menu-item-dropdown ${openMenu === 'obras' ? 'open' : ''}`}>
              <div className="menu-item" onClick={() => handleMenuClick('obras')}>
                <div className="menu-item-content">
                  <FaFilm /> Gerenciar Obras
                </div>
                <FaChevronDown className="dropdown-icon" />
              </div>
              <ul className="submenu">
                <li>
                  <a onClick={() => setObraModalOpen(true)}>Adicionar</a>
                </li>
                <li><Link to="/obras/atualizar">Atualizar</Link></li>
                <li><Link to="/obras/deletar">Deletar</Link></li>
              </ul>
            </li>

            {/* Dropdown: Contas */}
            <li className={`menu-item-dropdown ${openMenu === 'contas' ? 'open' : ''}`}>
              <div className="menu-item" onClick={() => handleMenuClick('contas')}>
                <div className="menu-item-content">
                  <FaUsers /> Gerenciar Contas
                </div>
                <FaChevronDown className="dropdown-icon" />
              </div>
              <ul className="submenu">
                <li>
                  <a onClick={() => setContaModalOpen(true)}>Adicionar</a>
                </li>
                <li><Link to="/contas/atualizar">Atualizar</Link></li>
                <li><Link to="/contas/deletar">Deletar</Link></li>
              </ul>
            </li>

            {/* Dropdown: Usuários */}
            <li className={`menu-item-dropdown ${openMenu === 'usuarios' ? 'open' : ''}`}>
              <div className="menu-item" onClick={() => handleMenuClick('usuarios')}>
                <div className="menu-item-content">
                  <FaUserCog /> Gerenciar Usuários
                </div>
                <FaChevronDown className="dropdown-icon" />
              </div>
              <ul className="submenu">
                <li>
                  <a onClick={() => setUsuarioModalOpen(true)}>Adicionar</a>
                </li>
                <li><Link to="/usuarios/atualizar">Atualizar</Link></li>
                <li><Link to="/usuarios/deletar">Deletar</Link></li>
              </ul>
            </li>

            {/* Dropdown: Gêneros */}
            <li className={`menu-item-dropdown ${openMenu === 'generos' ? 'open' : ''}`}>
              <div className="menu-item" onClick={() => handleMenuClick('generos')}>
                <div className="menu-item-content">
                  <FaTags /> Gerenciar Gêneros
                </div>
                <FaChevronDown className="dropdown-icon" />
              </div>
              <ul className="submenu">
                <li>
                  <a onClick={() => setGeneroModalOpen(true)}>Adicionar</a>
                </li>
                <li><Link to="/generos/atualizar">Atualizar</Link></li>
                <li><Link to="/generos/deletar">Deletar</Link></li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* ================================== */}
        {/* 2. CONTEÚDO PRINCIPAL */}
        {/* ================================== */}
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
            <div className="dashboard-card card-large">
              <h3>Visualizações por Gênero</h3>
              <div className="metric">Top 5 Gêneros</div>
              <div className="metric-change positive">+5% em Ficção Científica</div>
              <div className="placeholder-chart">
                <p>(Gráfico de Barras: Visualizações por Gênero)</p>
              </div>
            </div>

            <div className="dashboard-card card-large">
              <h3>Receita Total</h3>
              <div className="metric">R$ 1.287.450,00</div>
              <div className="metric-change positive">+3.2% vs mês passado</div>
              <div className="placeholder-chart">
                <p>(Gráfico de Linha: Receita ao longo do tempo)</p>
              </div>
            </div>

            <div className="dashboard-card card-medium">
              <h3>Horário de Pico</h3>
              <div className="metric">19:00 - 22:00</div>
              <div className="placeholder-chart-donut">
                <p>(Gráfico de Rosca: Visualizações por hora)</p>
              </div>
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

            <div className="dashboard-card card-small">
              <h3>Satisfação Média</h3>
              <div className="placeholder-rating-charts">
                <div className="rating-circle">
                  <strong>4.5</strong>
                  <span>Geral</span>
                </div>
                <div className="rating-circle">
                  <strong>4.8</strong>
                  <span>Catálogo</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card card-large">
              <h3>Novas Assinaturas</h3>
              <div className="metric">2.568</div>
              <div className="metric-change negative">-1.8% vs semana passada</div>
              <div className="placeholder-chart">
                <SatisfacaoChart />
                <p>(Gráfico de Linha: Novas assinaturas por dia)</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ================================== */}
      {/* 3. Modais de Inserção */}
      {/* ================================== */}
      {isUsuarioModalOpen && <InserirUsuario onClose={() => setUsuarioModalOpen(false)} />}
      {isObraModalOpen && <InserirObra onClose={() => setObraModalOpen(false)} />}
      {isContaModalOpen && <InserirConta onClose={() => setContaModalOpen(false)} />}
      {isGeneroModalOpen && <InserirGenero onClose={() => setGeneroModalOpen(false)} />}
    </div>
  );
}

export default Home;
