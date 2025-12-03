import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserRow from '../../components/admin/UserRow';
import { fetchAllUsers, deleteUserById } from '../../utils/apiHelper';
import { getLoggedInUser } from '../../utils/localStorageHelper';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = getLoggedInUser();
  const isVendedor = (user?.role || user?.rol || '').toLowerCase() === 'vendedor';

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDeleteUser = async (userId) => {
    if (confirm('¿Eliminar usuario?')) {
      const res = await deleteUserById(userId);
      if (res.success) { alert('Eliminado'); loadUsers(); } else { alert('Error: ' + res.message); }
    }
  };

  if (loading) return <div className="p-4">Cargando...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Usuarios</h1>
        {!isVendedor && (
          <Link to="/admin/usuarios/nuevo" className="btn btn-primary">Crear Usuario</Link>
        )}
      </div>
      <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Región</th><th>Rol</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <UserRow
                  key={u.user_id || u.id}
                  user={{ ...u, id: u.user_id || u.id }}
                  onDelete={() => handleDeleteUser(u.user_id || u.id)}
                  readOnly={isVendedor}
                />
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}
export default AdminUsers;