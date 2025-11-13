import React, { useState } from 'react';
import './Home.css';
import {
  FaFilm, FaUsers, FaUserCog, FaTags, FaSearch,
  FaUserCircle, FaChartBar, FaChevronDown,
} from 'react-icons/fa';
import { SlEnvolopeLetter } from "react-icons/sl";
import { MdLocalMovies, MdAnimation } from "react-icons/md";
import { Link } from 'react-router-dom';

import InserirUsuarioPesquisa from '../components/InserirUsuarioPesquisa';
import { InserirUsuario } from '../components/InserirUsuario'
import { AtualizarUsuario } from '../components/AtualizarUsuario'
import { DeletarUsuario } from '../components/DeletarUsuario'

import Dashboard from '../components/Dashboard'; 
import Views from '../components/Views';
import Procedures from '../components/Procedures';
import InserirObra from '../components/InserirObra';
import AtualizarObra from '../components/AtualizarObra';
import DeletarObra from '../components/DeletarObra';

function Home() {
  const [openMenu, setOpenMenu] = useState(null);
  const [isUsuarioPesquisaModalOpen, setUsuarioPesquisaModalOpen] = useState(false);

  const [isUsuarioModalOpen, setUsuarioModalOpen] = useState(false);
  const [isUsuarioAtualizarModalOpen, setUsuarioAtualizarModalOpen] = useState(false);
  const [isUsuarioDeletarModalOpen, setUsuarioDeletarModalOpen] = useState(false);

  const [isContaModalOpen, setContaModalOpen] = useState(false);

  const [isObraModalOpen, setObraModalOpen] = useState(false);
  const [isObraAtualizarOpen, setObraAtualizarOpen] = useState(false);
  const [isObraDeletarOpen, setObraDeletarOpen] = useState(false);

  const [isGeneroModalOpen, setGeneroModalOpen] = useState(false);
  // Estado para controlar a aba ativa (Dashboard, Views, Procedures)
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

            <li className={`menu-item-dropdown ${openMenu === 'pesquisa' ? 'open' : ''}`}>
              <div className="menu-item" onClick={() => handleMenuClick('pesquisa')}>
                <div className="menu-item-content">
                  <FaUserCog /> Gerenciar Pesquisa
                </div>
                <FaChevronDown className="dropdown-icon" />
              </div>
              <ul className="submenu">
                <li><a onClick={() => setUsuarioPesquisaModalOpen(true)}>Adicionar</a></li>
                <li><Link to="/usuarios/atualizar">Atualizar</Link></li>
                <li><Link to="/usuarios/deletar">Deletar</Link></li>
              </ul>
            </li>

            {/* Usuários */}
            <li className={`menu-item-dropdown ${openMenu === 'usuarios' ? 'open' : ''}`}>
              <div className="menu-item" onClick={() => handleMenuClick('usuarios')}>
                <div className="menu-item-content">
                  <FaUserCog /> Gerenciar Usuario
                </div>
                <FaChevronDown className="dropdown-icon" />
              </div>
              <ul className="submenu">
                <li><a onClick={() => setUsuarioModalOpen(true)}>Adicionar</a></li>
                <li><a onClick={() => setUsuarioAtualizarModalOpen(true)}>Atualizar</a></li>
                <li><a onClick={() => setUsuarioDeletarModalOpen(true)}>Deletar</a></li>
              </ul>
            </li>

            <li className={`menu-item-dropdown ${openMenu === 'contas' ? 'open' : ''}`}>
              <div className="menu-item" onClick={() => handleMenuClick('contas')}>
                <div className="menu-item-content">
                  <SlEnvolopeLetter /> Gerenciar Contas
                </div>
                <FaChevronDown className="dropdown-icon" />
              </div>
              <ul className="submenu">
                <li><a onClick={() => setContaModalOpen(true)}>Adicionar</a></li>
                <li><Link to="/usuarios/atualizar">Atualizar</Link></li>
                <li><Link to="/usuarios/deletar">Deletar</Link></li>
              </ul>
            </li>

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
              className={`tab-button ${activeTab === 'consultas' ? 'active' : ''}`}
              onClick={() => setActiveTab('consultas')}
            >
              Views
            </button>
            <button
              className={`tab-button ${activeTab === 'procedures' ? 'active' : ''}`}
              onClick={() => setActiveTab('procedures')}
            >
              Procedures
            </button>
          </nav>

          <div className="tab-content">
            {activeTab === 'dashboard' && <Dashboard />} 
            {activeTab === 'consultas' && <Views />}
            {activeTab === 'procedures' && <Procedures />}
          </div>

        </main>
      </div>

      {/* MODAIS */}
      {isUsuarioPesquisaModalOpen && <InserirUsuarioPesquisa onClose={() => setUsuarioPesquisaModalOpen(false)} />}
      {isContaModalOpen && <InserirUsuarioPesquisa onClose={() => setContaModalOpen(false)} />}

      {isUsuarioModalOpen && <InserirUsuario onClose={() => setUsuarioModalOpen(false)} />}
      {isUsuarioAtualizarModalOpen && <AtualizarUsuario onClose={() => setUsuarioAtualizarModalOpen(false)} />}
      {isUsuarioDeletarModalOpen && <DeletarUsuario onClose={() => setUsuarioDeletarModalOpen(false)} />}
        
      {isObraModalOpen && <InserirObra onClose={() => setObraModalOpen(false)} />}
      {isObraAtualizarOpen && <AtualizarObra onClose={() => setObraAtualizarOpen(false)} />}
      {isObraDeletarOpen && <DeletarObra onClose={() => setObraDeletarOpen(false)} />} 

      {isGeneroModalOpen && <InserirUsuarioPesquisa onClose={() => setGeneroModalOpen(false)} />}
    </div>
  );
}

export default Home;