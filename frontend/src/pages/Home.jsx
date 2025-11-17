import React, { useState } from 'react';
import './Home.css';
import {
  FaFilm, FaUsers, FaUserCog, FaTags, FaSearch,
  FaUserCircle, FaChartBar, FaChevronDown,
} from 'react-icons/fa';
import { SlEnvolopeLetter } from "react-icons/sl";
import { MdLocalMovies, MdAnimation } from "react-icons/md";
import { Link } from 'react-router-dom';

// Componentes CRUD de Usuário
import InserirUsuarioPesquisa from '../components/InserirUsuarioPesquisa';
/*
 * =================================================================
 * CORREÇÃO DE ERRO DE COMPILAÇÃO:
 * Alterado de 'import InserirUsuario' para 'import { InserirUsuario }'
 * para corresponder ao seu arquivo 'InserirUsuario.jsx'.
 * =================================================================
 */
import { InserirUsuario } from '../components/InserirUsuario';
import { AtualizarUsuario } from '../components/AtualizarUsuario';
import { DeletarUsuario } from '../components/DeletarUsuario';

// Componentes CRUD de Obra
import InserirObra from '../components/InserirObra';
import AtualizarObra from '../components/AtualizarObra';
import DeletarObra from '../components/DeletarObra';

// === Imports de CONTA (Adicionados) ===
import InserirConta from '../components/InserirConta';
import AtualizarConta from '../components/AtualizarConta';
import DeletarConta from '../components/DeletarConta';

// === Imports de GÊNERO (Adicionados) ===
import InserirGenero from '../components/InserirGenero';
import AtualizarGenero from '../components/AtualizarGenero';
import DeletarGenero from '../components/DeletarGenero';

// Componentes de Conteúdo (PowerBI Mantido)
import Dashboard from '../components/Dashboard';
import Procedures from '../components/Procedures';
import PowerBI from '../components/PowerBI'; // MANTIDO 100%

function Home() {
  const [openMenu, setOpenMenu] = useState(null);

  // Estados de MODAL para PESQUISA/USUÁRIO
  const [isUsuarioPesquisaModalOpen, setUsuarioPesquisaModalOpen] = useState(false);
  const [isUsuarioModalOpen, setUsuarioModalOpen] = useState(false);
  const [isUsuarioAtualizarModalOpen, setUsuarioAtualizarModalOpen] = useState(false);
  const [isUsuarioDeletarModalOpen, setUsuarioDeletarModalOpen] = useState(false);

  // === Estados de CONTA (Adicionados) ===
  const [isContaModalOpen, setContaModalOpen] = useState(false);
  const [isContaAtualizarOpen, setContaAtualizarOpen] = useState(false);
  const [isContaDeletarOpen, setContaDeletarOpen] = useState(false);

  // Estados de MODAL para OBRA
  const [isObraModalOpen, setObraModalOpen] = useState(false);
  const [isObraAtualizarOpen, setObraAtualizarOpen] = useState(false);
  const [isObraDeletarOpen, setObraDeletarOpen] = useState(false);

  // === Estados de GÊNERO (Adicionados) ===
  const [isGeneroModalOpen, setGeneroModalOpen] = useState(false);
  const [isGeneroAtualizarOpen, setGeneroAtualizarOpen] = useState(false);
  const [isGeneroDeletarOpen, setGeneroDeletarOpen] = useState(false);

  // Estado para controlar a aba ativa (Mantido)
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

              {/* Gerenciar Pesquisa (CORREÇÃO DE SINTAXE className) */}
              <li className={`menu-item-dropdown ${openMenu === 'pesquisa' ? 'open' : ''}`}>
                <div className="menu-item" onClick={() => handleMenuClick('pesquisa')}>
                  <div className="menu-item-content">
                    <FaUserCog /> Gerenciar Pesquisa
                  </div>
                  <FaChevronDown className="dropdown-icon" />
                </div>
                <ul className="submenu">
                  <li><a onClick={() => setUsuarioPesquisaModalOpen(true)}>Adicionar</a></li>
                </ul>
              </li>

              {/* Gerenciar Usuário (CORREÇÃO DE SINTAXE className) */}
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

              {/* Gerenciar Contas (CORRIGIDO) */}
              <li className={`menu-item-dropdown ${openMenu === 'contas' ? 'open' : ''}`}>
                <div className="menu-item" onClick={() => handleMenuClick('contas')}>
                  <div className="menu-item-content">
                    <SlEnvolopeLetter /> Gerenciar Contas
                  </div>
                  <FaChevronDown className="dropdown-icon" />
                </div>
                <ul className="submenu">
                  <li><a onClick={() => setContaModalOpen(true)}>Adicionar</a></li>
                  <li><a onClick={() => setContaAtualizarOpen(true)}>Atualizar</a></li>
                  <li><a onClick={() => setContaDeletarOpen(true)}>Deletar</a></li>
                </ul>
              </li>

              {/* Gerenciar Obras (CORREÇÃO DE SINTAXE className) */}
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

              {/* Gerenciar Gêneros (CORRIGIDO) */}
              <li className={`menu-item-dropdown ${openMenu === 'generos' ? 'open' : ''}`}>
                <div className="menu-item" onClick={() => handleMenuClick('generos')}>
                  <div className="menu-item-content">
                    <MdAnimation /> Gerenciar Generos
                  </div>
                  <FaChevronDown className="dropdown-icon" />
                </div>
                <ul className="submenu">
                  <li><a onClick={() => setGeneroModalOpen(true)}>Adicionar</a></li>
                  <li><a onClick={() => setGeneroAtualizarOpen(true)}>Atualizar</a></li>
                  <li><a onClick={() => setGeneroDeletarOpen(true)}>Deletar</a></li>
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

            {/* NAVEGAÇÃO DAS ABAS (PowerBI MANTIDO - CORREÇÃO DE SINTAXE className) */}
            <nav className="tab-navigation">
              <button
                  className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
              >
                Pesquisa
              </button>
              <button
                  className={`tab-button ${activeTab === 'procedures' ? 'active' : ''}`}
                  onClick={() => setActiveTab('procedures')}
              >
                Procedimentos
              </button>
              <button
                  className={`tab-button ${activeTab === 'power_bi' ? 'active' : ''}`}
                  onClick={() => setActiveTab('power_bi')}
              >
                Power BI
              </button>
            </nav>

            {/* CONTEÚDO DAS ABAS (PowerBI MANTIDO) */}
            <div className="tab-content">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'procedures' && <Procedures />}
              {activeTab === 'power_bi' && <PowerBI />}
            </div>

          </main>
        </div>

        {/* === MODAIS (SEÇÃO ATUALIZADA) === */}
        {/* Modais de Pesquisa/Usuário (Mantidos) */}
        {isUsuarioPesquisaModalOpen && <InserirUsuarioPesquisa onClose={() => setUsuarioPesquisaModalOpen(false)} />}

        {/* (Chamada corrigida devido ao import) */}
        {isUsuarioModalOpen && <InserirUsuario onClose={() => setUsuarioModalOpen(false)} />}
        {isUsuarioAtualizarModalOpen && <AtualizarUsuario onClose={() => setUsuarioAtualizarModalOpen(false)} />}
        {isUsuarioDeletarModalOpen && <DeletarUsuario onClose={() => setUsuarioDeletarModalOpen(false)} />}

        {/* Modais de Conta (Adicionados) */}
        {isContaModalOpen && <InserirConta onClose={() => setContaModalOpen(false)} />}
        {isContaAtualizarOpen && <AtualizarConta onClose={() => setContaAtualizarOpen(false)} />}
        {isContaDeletarOpen && <DeletarConta onClose={() => setContaDeletarOpen(false)} />}

        {/* Modais de Obra (Mantidos) */}
        {isObraModalOpen && <InserirObra onClose={() => setObraModalOpen(false)} />}
        {isObraAtualizarOpen && <AtualizarObra onClose={() => setObraAtualizarOpen(false)} />}
        {isObraDeletarOpen && <DeletarObra onClose={() => setObraDeletarOpen(false)} />}

        {/* Modal de Gênero (Adicionados e Corrigido o bug de 'InserirUsuarioPesquisa') */}
        {isGeneroModalOpen && <InserirGenero onClose={() => setGeneroModalOpen(false)} />}
        {isGeneroAtualizarOpen && <AtualizarGenero onClose={() => setGeneroAtualizarOpen(false)} />}
        {isGeneroDeletarOpen && <DeletarGenero onClose={() => setGeneroDeletarOpen(false)} />}
      </div>
  );
}

export default Home;