import React from 'react';
import './Home.css';
import { 
  FaFilm, FaUsers, FaUserCog, FaTags, FaSearch, 
  FaUserCircle, FaChartBar, FaClock, FaStar, FaListOl 
} from 'react-icons/fa';

import SatisfacaoChart from '../components/SatisfacaoChart';

function Home() {
  return (
    <div className="home-container">
      {/* ================================== */}
      {/* 1. SIDEBAR (MENU LATERAL)     */}
      {/* ================================== */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          StreamAnalytics
        </div>
        
        <ul className="sidebar-menu">
          <li className="menu-header">Menu</li>
          <li className="menu-item active">
            <FaChartBar /> Dashboard
          </li>
          
          {/* Seção solicitada com sub-opções */}
          <li className="menu-header">Gerenciar Entidades</li>
          <li className="menu-item">
            <FaFilm /> Gerenciar Obras
          </li>
          <li className="menu-item">
            <FaUsers /> Gerenciar Contas
          </li>
          <li className="menu-item">
            <FaUserCog /> Gerenciar Usuários
          </li>
          <li className="menu-item">
            <FaTags /> Gerenciar Gêneros
          </li>
        </ul>
      </nav>

      {/* ================================== */}
      {/* 2. CONTEÚDO PRINCIPAL      */}
      {/* ================================== */}
      <main className="main-content">
        {/* 2a. Cabeçalho do Conteúdo */}
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

        {/* 2b. Grid do Dashboard (com flex-wrap) */}
        <h1>Dashboard</h1>
        
        <section className="dashboard-grid">
          
          {/* Card 6: Visualizações por Gênero (Gráfico de Barras) */}
            <div className="dashboard-card card-large">
            <h3>Visualizações por Gênero</h3>
            <div className="metric">Top 5 Gêneros</div>
            <div className="metric-change positive">+5% em Ficção Científica</div>
            <div className="placeholder-chart">
                {/* Você pode adicionar um componente de gráfico de barras aqui */}
                <p>(Gráfico de Barras: Visualizações por Gênero)</p>
            </div>
            </div>

          {/* Card 1: Receita (Inspirado em 'Revenue') */}
          <div className="dashboard-card card-large">
            <h3>Receita Total</h3>
            <div className="metric">R$ 1.287.450,00</div>
            <div className="metric-change positive">+3.2% vs mês passado</div>
            <div className="placeholder-chart">
              {/* Você pode adicionar um componente de gráfico de linha aqui */}
              <p>(Gráfico de Linha: Receita ao longo do tempo)</p>
            </div>
          </div>

          {/* Card 2: Horário de Pico (Inspirado em 'Order Time') */}
          <div className="dashboard-card card-medium">
            <h3>Horário de Pico</h3>
            <div className="metric">19:00 - 22:00</div>
            <div className="placeholder-chart-donut">
              {/* Você pode adicionar um componente de gráfico de rosca aqui */}
              <p>(Gráfico de Rosca: Visualizações por hora)</p>
            </div>
          </div>

          {/* Card 3: Conteúdo Mais Visto (Inspirado em 'Most Ordered Food') */}
          <div className="dashboard-card card-medium">
            <h3>Conteúdo Mais Visto</h3>
            <ul className="top-content-list">
              <li><span>1. A Origem da Matrix</span> <span>1.2M views</span></li>
              <li><span>2. Conexões Perdidas</span> <span>980K views</span></li>
              <li><span>3. O Último Horizonte</span> <span>750K views</span></li>
              <li><span>4. Crônicas de Neon</span> <span>610K views</span></li>
            </ul>
          </div>

          {/* Card 4: Avaliações (Inspirado em 'Your Rating') */}
          <div className="dashboard-card card-small">
            <h3>Satisfação Média</h3>
            <div className="placeholder-rating-charts">
              {/* Você pode adicionar gráficos radiais aqui */}
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

          {/* Card 5: Novas Assinaturas (Inspirado em 'Order') */}
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
  );
}

export default Home;