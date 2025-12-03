// src/components/admin/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../../utils/localStorageHelper'; 

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('¿Está seguro de que desea cerrar sesión?')) {
      logoutUser(); 
      navigate('/');
    }
  };

  return (
    <aside className="admin-sidebar">
      <NavLink to="/admin" className="logo-text">
        HuertoHogar <span style={{color:'var(--verde-principal)'}}>Admin</span>
      </NavLink>
      
      <nav className="admin-nav">
        <NavLink to="/admin" end className={({isActive})=>isActive?'active':''}>Dashboard</NavLink>
        <NavLink to="/admin/ordenes" className={({isActive})=>isActive?'active':''}>Órdenes</NavLink>
        <NavLink to="/admin/productos" className={({isActive})=>isActive?'active':''}>Productos</NavLink>
        <NavLink to="/admin/usuarios" className={({isActive})=>isActive?'active':''}>Usuarios</NavLink>
        <NavLink to="/admin/categorias" className={({isActive})=>isActive?'active':''}>Categorías</NavLink>
        <NavLink to="/admin/reportes" className={({isActive})=>isActive?'active':''}>Reportes</NavLink>
      </nav>

      <div className="sidebar-footer">
        {/* Botón para ir a la tienda sin cerrar sesión */}
        <Link to="/" className="btn-action btn-view w-100 text-center mb-3" style={{ display: 'block', textDecoration: 'none' }}>
          <i className="bi bi-shop"></i> Ir a la Tienda
        </Link>

        <div className="user-profile">
           <img src="https://ui-avatars.com/api/?name=Admin&background=2E8B57&color=fff&size=40" alt="Perfil" className="user-avatar" />
           <div className="user-info">
             <span style={{ fontWeight: 'bold' }}>Panel</span>
             <small>Gestión</small>
           </div>
        </div>
        
        <button className="btn-logout mt-3" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </aside>
  );
}
export default Sidebar;