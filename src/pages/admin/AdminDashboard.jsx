// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../components/admin/DashboardCard'; 
import UserRow from '../../components/admin/UserRow'; 
// CAMBIO: Importamos los helpers de la API
import { fetchAllUsers, deleteUserById } from '../../utils/apiHelper';
import { apiGetProductos } from '../../utils/apiHelperProducto';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos exclusivamente desde la API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener Usuarios
        const usersData = await fetchAllUsers();
        setUsers(usersData || []);

        // 2. Obtener Productos
        const productsData = await apiGetProductos();
        setProducts(productsData || []);

      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
        // Si falla, dejamos las listas vacías para no romper la UI
        setUsers([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const productCount = products.length;
  const userCount = users.length;
  // Calculamos ingresos estimados usando los datos de la API (precio * stock)
  const incomeEstimate = products.reduce((sum, p) => sum + (p.precio * (p.stock || 0)), 0);

  // Eliminar usuario usando la API
  const handleDeleteUser = async (userId) => {
    if (confirm('¿Eliminar usuario? Esta acción es permanente.')) {
        const result = await deleteUserById(userId);
        if (result.success) {
            alert('Usuario eliminado.');
            // Recargar lista
            const updatedUsers = await fetchAllUsers();
            setUsers(updatedUsers);
        } else {
            alert('Error al eliminar: ' + result.message);
        }
    }
  };

  if (loading) {
    return <div className="p-5 text-center">Cargando panel de control...</div>;
  }

  return (
    <div>
      <header className="mb-4">
        <h2>Panel de Control</h2>
        <p className="text-muted">Bienvenido de nuevo, Administrador.</p>
      </header>

      {/* Tarjetas de Resumen */}
      <section className="dashboard-grid">
        <DashboardCard title="Productos" value={productCount} />
        <DashboardCard title="Usuarios" value={userCount} />
        <DashboardCard title="Ingresos Estimados" value={`$${incomeEstimate.toLocaleString('es-CL')}`} />
      </section>

      {/* Tabla de Usuarios Recientes (Datos reales de API) */}
      <section className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Usuarios Recientes</h3>
          <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
            + Nuevo Usuario
          </Link>
        </div>

        <div className="table-container">
          {users.length === 0 ? (
             <p className="p-3 text-muted">No hay usuarios registrados o el servidor está desconectado.</p>
          ) : (
            <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Región</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mostramos los primeros 5 usuarios */}
                  {users.slice(0, 5).map(user => (
                     <UserRow
                        key={user.user_id || user.id} 
                        user={{
                            ...user,
                            id: user.user_id || user.id // Normalizamos el ID para el componente
                        }}
                        onDelete={() => handleDeleteUser(user.user_id || user.id)}
                      />
                  ))}
                </tbody>
            </table>
          )}
        </div>
        {users.length > 5 && (
            <div className="text-center mt-3">
            <Link to="/admin/usuarios" className="btn btn-link">Ver todos los usuarios &rarr;</Link>
            </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;