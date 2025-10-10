import React from 'react';
import { Link } from 'react-router-dom';
// O Bootstrap já deve estar instalado e importado no seu index.js principal.
// Se não estiver, adicione 'import 'bootstrap/dist/css/bootstrap.min.css';' ao seu index.js

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                {/* Usamos <Link> em vez de <a> para navegação interna sem recarregar a página */}
                <Link className="navbar-brand" to="/">
                    Serviço de Streaming
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">
                                Dashboard
                            </Link>
                        </li>

                        {/* Menu Dropdown - Usuários */}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#" // O React Router não gerencia o comportamento do dropdown. Deixe href="#" e use os atributos do Bootstrap.
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Usuários
                            </a>
                            <ul className="dropdown-menu">
                                {/* Tradução dos th:href para "to" no <Link> */}
                                <li><Link className="dropdown-item" to="/web/usuarios/criar-usuario">Inserir Usuario</Link></li>
                                <li><Link className="dropdown-item" to="/web/usuarios/update-usuario">Atualizar Usuario</Link></li>
                                <li><Link className="dropdown-item" to="/web/usuarios/delete-usuario">Deletar Usuario</Link></li>
                                <li><Link className="dropdown-item" to="/web/usuarios/buscar-por-email">Buscar por Email</Link></li>
                                <li><Link className="dropdown-item" to="/web/usuarios/buscar-por-bairro">Buscar por Bairro</Link></li>
                            </ul>
                        </li>

                        {/* Menu Dropdown - Obras */}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Obras
                            </a>
                            <ul className="dropdown-menu">
                                {/* Tradução dos th:href para "to" no <Link> */}
                                <li><Link className="dropdown-item" to="/criar-obra">Inserir Obra</Link></li>
                                <li><Link className="dropdown-item" to="/update-obra">Atualizar Obra</Link></li>
                                <li><Link className="dropdown-item" to="/delete-obra">Deletar Obra</Link></li>
                                <li><Link className="dropdown-item" to="web/consulta-obra-like">Consultar por Nome</Link></li>
                                <li><Link className="dropdown-item" to="/consulta-obra-join-genero">Consultar por Gênero</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;