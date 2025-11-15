import React, { useState } from 'react';
import './Home.css';
import {
  FaFilm, FaUsers, FaUserCog, FaTags, FaSearch,
  FaUserCircle, FaChartBar, FaChevronDown,
} from 'react-icons/fa';
import { SlEnvolopeLetter } from "react-icons/sl";
import { MdLocalMovies, MdAnimation } from "react-icons/md";
import { Link } from 'react-router-dom';

// Componentes CRUD de Usuário (Mantidos do Arquivo 1)
// NOTA: 'InserirUsuario' foi alterado para Named Import, conforme correção do Arquivo 2
import InserirUsuarioPesquisa from '../components/InserirUsuarioPesquisa';
import { InserirUsuario } from '../components/InserirUsuario';
import { AtualizarUsuario } from '../components/AtualizarUsuario';
import { DeletarUsuario } from '../components/DeletarUsuario';

// Componentes CRUD de Obra (Mantidos do Arquivo 1)
import InserirObra from '../components/InserirObra';
import AtualizarObra from '../components/AtualizarObra';
import DeletarObra from '../components/DeletarObra';

// Componentes CRUD de CONTA (NOVOS do Arquivo 2)
import InserirConta from '../components/InserirConta';
import AtualizarConta from '../components/AtualizarConta';
import DeletarConta from '../components/DeletarConta';

// Componentes de Conteúdo
import Dashboard from '../components/Dashboard';
import Procedures from '../components/Procedures';
import PowerBI from '../components/PowerBI'; // Mantido do Arquivo 1

function Home() {
  const [openMenu, setOpenMenu] = useState(null);

  // Estados de MODAL para PESQUISA/USUÁRIO (Mantidos do Arquivo 1)
  const [isUsuarioPesquisaModalOpen, setUsuarioPesquisaModalOpen] = useState(false);
  const [isUsuarioModalOpen, setUsuarioModalOpen] = useState(false);
  const [isUsuarioAtualizarModalOpen, setUsuarioAtualizarModalOpen] = useState(false);
  const [isUsuarioDeletarModalOpen, setUsuarioDeletarModalOpen] = useState(false);

  // Estados de MODAL para CONTA (ATUALIZADOS do Arquivo 2)
  const [isContaModalOpen, setContaModalOpen] = useState(false);
  const [isContaAtualizarOpen, setContaAtualizarOpen] = useState(false);
  const [isContaDeletarOpen, setContaDeletarOpen] = useState(false);

  // Estados de MODAL para OBRA (Mantidos do Arquivo 1)
  const [isObraModalOpen, setObraModalOpen] = useState(false);
  const [isObraAtualizarOpen, setObraAtualizarOpen] = useState(false);
  const [isObraDeletarOpen, setObraDeletarOpen] = useState(false);

  // Estado de MODAL para GÊNERO (Mantido do Arquivo 1)
  const [isGeneroModalOpen, setGeneroModalOpen] = useState(false);

  // Estado para controlar a aba ativa
  // Mantém a estrutura de 'dashboard', 'procedures', 'power_bi' do Arquivo 1
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

            {/* Gerenciar Pesquisa (Mantido do Arquivo 1, mas mais consistente) */}
            <li className={`menu-item-dropdown ${openMenu === 'pesquisa' ? 'open' : ''}`}>
              <div className="menu-item" onClick={() => handleMenuClick('pesquisa')}>
                <div className="menu-item-content">
                  <FaUserCog /> Gerenciar Pesquisa
                </div>
                <FaChevronDown className="dropdown-icon" />
              </div>
              <ul className="submenu">
                {/* Usando InserirUsuarioPesquisa do Arquivo 1 */}
                <li><a onClick={() => setUsuarioPesquisaModalOpen(true)}>Adicionar</a></li>
                {/* Os links Atualizar e Deletar foram removidos, conforme a versão simplificada do Arquivo 1,
                    mantendo o foco no componente InserirUsuarioPesquisa */}
              </ul>
            </li>

            {/* Gerenciar Usuário (Mantido completo do Arquivo 1) */}
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

            {/* Gerenciar Contas (CORRIGIDO com chamadas de modal do Arquivo 2) */}
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

            {/* Gerenciar Obras (Mantido do Arquivo 1) */}
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

            {/* Gerenciar Gêneros (Mantido do Arquivo 1) */}
            <li className={`menu-item-dropdown ${openMenu === 'generos' ? 'open' : ''}`}>
              <div className="menu-item" onClick={() => handleMenuClick('generos')}>
                <div className="menu-item-content">
                  <MdAnimation /> Gerenciar Generos
                </div>
                <FaChevronDown className="dropdown-icon" />
              </div>
              <ul className="submenu">
                <li><a onClick={() => setGeneroModalOpen(true)}>Adicionar</a></li>
                {/* Mantidos como Link (como no Arquivo 1) - Pode ser corrigido para modal se necessário */}
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

          {/* NAVEGAÇÃO DAS ABAS (Mantida do Arquivo 1: Pesquisa, Procedures, Power BI) */}
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

          <div className="tab-content">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'procedures' && <Procedures />}
            {activeTab === 'power_bi' && <PowerBI />}
          </div>

        </main>
      </div>

      {/* MODAIS */}
      {/* Modais de Pesquisa/Usuário (Mantidos do Arquivo 1) */}
      {isUsuarioPesquisaModalOpen && <InserirUsuarioPesquisa onClose={() => setUsuarioPesquisaModalOpen(false)} />}
      
      {isUsuarioModalOpen && <InserirUsuario onClose={() => setUsuarioModalOpen(false)} />}
      {isUsuarioAtualizarModalOpen && <AtualizarUsuario onClose={() => setUsuarioAtualizarModalOpen(false)} />}
      {isUsuarioDeletarModalOpen && <DeletarUsuario onClose={() => setUsuarioDeletarModalOpen(false)} />}

      {/* Modais de Conta (Implementados do Arquivo 2) */}
      {isContaModalOpen && <InserirConta onClose={() => setContaModalOpen(false)} />}
      {isContaAtualizarOpen && <AtualizarConta onClose={() => setContaAtualizarOpen(false)} />}
      {isContaDeletarOpen && <DeletarConta onClose={() => setContaDeletarOpen(false)} />}

      {/* Modais de Obra (Mantidos do Arquivo 1) */}
      {isObraModalOpen && <InserirObra onClose={() => setObraModalOpen(false)} />}
      {isObraAtualizarOpen && <AtualizarObra onClose={() => setObraAtualizarOpen(false)} />}
      {isObraDeletarOpen && <DeletarObra onClose={() => setObraDeletarOpen(false)} />}

      {/* Modal de Gênero (Mantido do Arquivo 1) */}
      {/* NOTA: Está usando 'InserirUsuarioPesquisa', o que pode ser um erro no código original, mas foi mantido. */}
      {isGeneroModalOpen && <InserirUsuarioPesquisa onClose={() => setGeneroModalOpen(false)} />}
    </div>
  );
}

export default Home;