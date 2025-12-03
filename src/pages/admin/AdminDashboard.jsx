import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../components/admin/DashboardCard'; 
import UserRow from '../../components/admin/UserRow'; 
import { fetchAllUsers, deleteUserById } from '../../utils/apiHelper';
import { apiGetProductos } from '../../utils/apiHelperProducto';
import { getLoggedInUser } from '../../utils/localStorageHelper';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determinar si es vendedor
  const user = getLoggedInUser();
  const isVendedor = (user?.role || user?.rol || '').toLowerCase() === 'vendedor';

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const usersData = await fetchAllUsers();
        setUsers(usersData || []);
        const productsData = await apiGetProductos();
        setProducts(productsData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const productCount = products.length;
  const userCount = users.length;
  const incomeEstimate = products.reduce((sum, p) => sum + (p.precio * (p.stock || 0)), 0);

  const handleDeleteUser = async (userId) => {
    if (confirm('¿Eliminar usuario?')) {
        const result = await deleteUserById(userId);
        if (result.success) {
            alert('Usuario eliminado.');
            const updated = await fetchAllUsers();
            setUsers(updated);
        } else {
            alert('Error: ' + result.message);
        }
    }
  };

  if (loading) return <div className="p-5 text-center">Cargando...</div>;

  return (
    <div>
      <header className="mb-4">
        <h2>Panel de Control</h2>
        <p className="text-muted">
          Bienvenido, {user?.nombre || 'Usuario'} 
          {isVendedor && <span className="badge bg-warning text-dark ms-2">Vendedor (Solo Lectura)</span>}
        </p>
      </header>

      <section className="dashboard-grid">
        <DashboardCard title="Productos" value={productCount} />
        <DashboardCard title="Usuarios" value={userCount} />
        <DashboardCard title="Ingresos Estimados" value={`$${incomeEstimate.toLocaleString('es-CL')}`} />
      </section>

      <section className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Usuarios Recientes</h3>
          {/* Ocultar botón si es vendedor */}
          {!isVendedor && (
            <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
              + Nuevo Usuario
            </Link>
          )}
        </div>

        <div className="table-container">
          {users.length === 0 ? (
             <p className="p-3 text-muted">No hay datos.</p>
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
                  {users.slice(0, 5).map(u => (
                     <UserRow
                        key={u.user_id || u.id} 
                        user={{ ...u, id: u.user_id || u.id }}
                        onDelete={() => handleDeleteUser(u.user_id || u.id)}
                        readOnly={isVendedor} // Pasamos la restricción
                      />
                  ))}
                </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;