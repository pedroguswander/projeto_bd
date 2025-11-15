import React, { useState } from 'react';
import './Home.css';
import {
  FaFilm, FaUsers, FaUserCog, FaTags, FaSearch,
  FaUserCircle, FaChartBar, FaChevronDown,
} from 'react-icons/fa';
import { SlEnvolopeLetter } from "react-icons/sl";
import { MdLocalMovies, MdAnimation } from "react-icons/md";
import { Link } from 'react-router-dom';

/*
 * =================================================================
 * ERRO 2 e 3 CORRIGIDO:
 * A linha abaixo foi alterada de "import InserirUsuario from..."
 * para "import { InserirUsuario } from...".
 * Isso corrige o erro "export 'default' was not found".
 * =================================================================
 */
import { InserirUsuario } from '../components/InserirUsuario';

// Imports existentes
import Dashboard from '../components/Dashboard';

/*
 * =================================================================
 * ERRO 1 CORRIGIDO:
 * A linha abaixo foi COMENTADA porque o arquivo Views.jsx
 * não foi encontrado e estava quebrando a compilação.
 * =================================================================
 */
// import Views from '../components/Views';

import Procedures from '../components/Procedures';
import InserirObra from '../components/InserirObra';
import AtualizarObra from '../components/AtualizarObra';
import DeletarObra from '../components/DeletarObra';

// Imports NOVOS para a funcionalidade de CONTA
import InserirConta from '../components/InserirConta';
import AtualizarConta from '../components/AtualizarConta';
import DeletarConta from '../components/DeletarConta';
import PowerBI from '../components/PowerBI';

function Home() {
  const [openMenu, setOpenMenu] = useState(null);

  // Estados de Modal existentes
  const [isUsuarioModalOpen, setUsuarioModalOpen] = useState(false);
  const [isObraModalOpen, setObraModalOpen] = useState(false);
  const [isObraAtualizarOpen, setObraAtualizarOpen] = useState(false);
  const [isObraDeletarOpen, setObraDeletarOpen] = useState(false);
  const [isGeneroModalOpen, setGeneroModalOpen] = useState(false);

  // Estados de Modal de CONTA (Atualizados)
  const [isContaModalOpen, setContaModalOpen] = useState(false);
  const [isContaAtualizarOpen, setContaAtualizarOpen] = useState(false); // NOVO
  const [isContaDeletarOpen, setContaDeletarOpen] = useState(false); // NOVO

  // Estado da Aba
  const [activeTab, setActiveTab] = useState('dashboard');

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

              {/* Gerenciar Pesquisa */}
              <li className={`menu-item-dropdown ${openMenu === 'pesquisa' ? 'open' : ''}`}>
                <div className="menu-item" onClick={() => handleMenuClick('pesquisa')}>
                  <div className="menu-item-content">
                    <FaUserCog /> Gerenciar Pesquisa
                  </div>
                  <FaChevronDown className="dropdown-icon" />
                </div>
                <ul className="submenu">
                  <li><a onClick={() => setUsuarioModalOpen(true)}>Adicionar</a></li>
                  <li><Link to="/usuarios/atualizar">Atualizar</Link></li>
                  <li><Link to="/usuarios/deletar">Deletar</Link></li>
                </ul>
              </li>

              {/* Gerenciar Usuario */}
              <li className={`menu-item-dropdown ${openMenu === 'usuarios' ? 'open' : ''}`}>
                <div className="menu-item" onClick={() => handleMenuClick('usuarios')}>
                  <div className="menu-item-content">
                    <FaUserCog /> Gerenciar Usuario
                  </div>
                  <FaChevronDown className="dropdown-icon" />
                </div>
                <ul className="submenu">
                  <li><a onClick={() => setUsuarioModalOpen(true)}>Adicionar</a></li>
                  <li><Link to="/usuarios/atualizar">Atualizar</Link></li>
                  <li><Link to="/usuarios/deletar">Deletar</Link></li>
                </ul>
              </li>

              {/* === GERENCIAR CONTAS (SEÇÃO CORRIGIDA) === */}
              <li className={`menu-item-dropdown ${openMenu === 'contas' ? 'open' : ''}`}>
                <div className="menu-item" onClick={() => handleMenuClick('contas')}>
                  <div className="menu-item-content">
                    <SlEnvolopeLetter /> Gerenciar Contas
                  </div>
                  <FaChevronDown className="dropdown-icon" />
                </div>
                <ul className="submenu">
                  {/* CORRIGIDO */}
                  <li><a onClick={() => setContaModalOpen(true)}>Adicionar</a></li>
                  {/* CORRIGIDO */}
                  <li><a onClick={() => setContaAtualizarOpen(true)}>Atualizar</a></li>
                  {/* CORRIGIDO */}
                  <li><a onClick={() => setContaDeletarOpen(true)}>Deletar</a></li>
                </ul>
              </li>
              {/* === FIM DA ATUALIZAÇÃO === */}

              {/* Gerenciar Obras */}
              <li className={`menu-item-dropdown ${openMenu === 'obras' ? 'open' : ''}`}>
                <div className="menu-item" onClick={() => handleMenuClick('obras')}>
                  <div className="menu-item-content">
                    <MdLocalMovies /> Gerenciar Obras
                  </div>
                  <FaChevronDown className="dropdown-icon" />
                </div>
                <ul className="submenu">
                  <li><a onClick={() => setObraModalOpen(true)}>Adicionar</a></li>
                  <li><a onClick={() => setObraAtualizarOpen(true)}>Atualizar</a></li>
                  <li><a onClick={() => setObraDeletarOpen(true)}>Deletar</a></li>
                </ul>
              </li>

              {/* Gerenciar Generos */}
              <li className={`menu-item-dropdown ${openMenu === 'generos' ? 'open' : ''}`}>
                <div className="menu-item" onClick={() => handleMenuClick('generos')}>
                  <div className="menu-item-content">
                    <MdAnimation /> Gerenciar Generos
                  </div>
                  <FaChevronDown className="dropdown-icon" />
                </div>
                <ul className="submenu">
                  <li><a onClick={() => setGeneroModalOpen(true)}>Adicionar</a></li>
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

            {/* NAVEGAÇÃO DAS ABAS */}
            <nav className="tab-navigation">
              <button
                  className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button
                  className={`tab-button ${activeTab === 'procedures' ? 'active' : ''}`}
                  onClick={() => setActiveTab('procedures')}
              >
                Procedures
              </button>
              <button
                  className={`tab-button ${activeTab === 'power_bi' ? 'active' : ''}`}
                  onClick={() => setActiveTab('power_bi')}
              >
                Power BI
              </button>
            </nav>

            {/* CONTEÚDO DAS ABAS */}
            <div className="tab-content">
              {activeTab === 'dashboard' && <Dashboard />}

              {activeTab === 'procedures' && <Procedures />}

              {activeTab === 'power_bi' && <PowerBI />}
            </div>

          </main>
        </div>

        {/* === SEÇÃO DE MODAIS (ATUALIZADA) === */}

        {/* * =================================================================
        * ERRO 2 e 3 CORRIGIDO:
        * O componente <InserirUsuario> é chamado corretamente
        * por causa da correção no import (linha 22).
        * =================================================================
        */
        }
        {isUsuarioModalOpen && <InserirUsuario onClose={() => setUsuarioModalOpen(false)} />}

        {/* MODAIS DE CONTA (CORRIGIDOS) */}
        {isContaModalOpen && <InserirConta onClose={() => setContaModalOpen(false)} />}
        {isContaAtualizarOpen && <AtualizarConta onClose={() => setContaAtualizarOpen(false)} />}
        {isContaDeletarOpen && <DeletarConta onClose={() => setContaDeletarOpen(false)} />}

        {/* MODAIS DE OBRA */}
        {isObraModalOpen && <InserirObra onClose={() => setObraModalOpen(false)} />}
        {isObraAtualizarOpen && <AtualizarObra onClose={() => setObraAtualizarOpen(false)} />}
        {isObraDeletarOpen && <DeletarObra onClose={() => setObraDeletarOpen(false)} />}

        {/* MODAL DE GÊNERO */}
        {isGeneroModalOpen && <InserirUsuario onClose={() => setGeneroModalOpen(false)} />}
      </div>
  );
}

export default Home;