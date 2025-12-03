// src/components/store/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { getLoggedInUser, logoutUser, getCart } from '../../utils/localStorageHelper';

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const updateNavbarState = () => {
    setUser(getLoggedInUser());
    const currentCart = getCart();
    const totalItems = currentCart.reduce((sum, item) => sum + (item.cantidad || 0), 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    updateNavbarState();
    window.addEventListener('storageUpdate', updateNavbarState);
    return () => window.removeEventListener('storageUpdate', updateNavbarState);
  }, []);

  const handleLogout = () => {
    logoutUser();
    updateNavbarState();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          HuertoHogar
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavStore">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavStore">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
             <li className="nav-item"><NavLink className="nav-link" to="/" end>Inicio</NavLink></li>
             <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
             <li className="nav-item"><NavLink className="nav-link" to="/categorias">Categorías</NavLink></li>
             <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contacto</NavLink></li>
             
             {/* --- ENLACE DIRECTO AL ADMIN PARA PROBAR SEGURIDAD --- */}
             {/* Este enlace aparecerá siempre para que puedas testear. 
                 Si no estás logueado como admin, ProtectedRoute te echará. */}
             <li className="nav-item border-start ms-2 ps-2 d-none d-lg-block">
                <Link className="nav-link text-warning" to="/admin" title="Probar Acceso Admin">
                   <i className="bi bi-shield-lock"></i> Panel Admin
                </Link>
             </li>
             {/* Versión móvil del enlace admin */}
             <li className="nav-item d-lg-none">
                <Link className="nav-link text-warning" to="/admin">Panel Admin</Link>
             </li>
             {/* ---------------------------------------------------- */}
          </ul>

          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item me-3">
              <NavLink className="nav-link position-relative" to="/carrito">
                <i className="bi bi-cart-fill fs-5"></i> 
                { cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>
            
            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Hola, {user.nombre}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/perfil">Mi Perfil</Link></li>
                  {user.role === 'admin' && (
                    <li><Link className="dropdown-item fw-bold" to="/admin">Ir al Admin</Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar Sesión</button></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink className="btn btn-outline-light btn-sm" to="/login">Iniciar Sesión</NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;