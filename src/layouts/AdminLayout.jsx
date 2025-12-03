// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Footer from '../components/admin/Footer';
import '../admin-styles.css'; // Importante: Estilos cargados aquí

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content-wrapper">
        <main className="admin-main">
          {/* Aquí se renderizará el contenido específico de cada ruta */}
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default AdminLayout;