// src/components/admin/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
      console.log('Cerrando sesión...');
      navigate('/');
    }
  };

  return (
    <aside className="admin-sidebar">
      <NavLink to="/admin" className="logo-text">
        HuertoHogar <span style={{color:'var(--verde-principal)'}}>Admin</span>
      </NavLink>
      
      {/* Navegación */}
      <nav className="admin-nav">
        <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/ordenes" className={({ isActive }) => (isActive ? 'active' : '')}>
          Órdenes
        </NavLink>
        <NavLink to="/admin/productos" className={({ isActive }) => (isActive ? 'active' : '')}>
          Productos
        </NavLink>
        <NavLink to="/admin/usuarios" className={({ isActive }) => (isActive ? 'active' : '')}>
          Usuarios
        </NavLink>
        <NavLink to="/admin/categorias" className={({ isActive }) => (isActive ? 'active' : '')}>
          Categorías
        </NavLink>
        <NavLink to="/admin/reportes" className={({ isActive }) => (isActive ? 'active' : '')}>
          Reportes
        </NavLink>
      </nav>

      {/* Footer del Sidebar (Perfil y Logout) */}
      <div className="sidebar-footer">
        <div className="user-profile">
           <img 
             src="https://ui-avatars.com/api/?name=Admin&background=2E8B57&color=fff&size=40" 
             alt="Perfil" 
             className="user-avatar" 
           />
           <div className="user-info">
             <span style={{ fontWeight: 'bold' }}>Admin</span>
             <small>Administrador</small>
           </div>
        </div>
        <button className="btn-logout mt-3" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;