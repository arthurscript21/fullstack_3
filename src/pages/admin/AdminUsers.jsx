// src/pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserRow from '../../components/admin/UserRow';
// Importamos las funciones de la API en lugar de data/usersData
import { fetchAllUsers, deleteUserById } from '../../utils/apiHelper';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar usuarios desde la API
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      // fetchAllUsers devuelve un array, si falla devuelve []
      setUsers(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError('No se pudieron cargar los usuarios desde el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Eliminar usuario vía API
  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      const result = await deleteUserById(userId);
      
      if (result.success) {
        alert('Usuario eliminado exitosamente.');
        loadUsers(); // Recargar la lista
      } else {
        alert('Error al eliminar usuario: ' + result.message);
      }
    }
  };

  if (loading) return <div className="p-4">Cargando usuarios...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
          Crear Usuario
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {users.length === 0 && !error ? (
        <div className="alert alert-info">No hay usuarios registrados o no se pudo conectar a la API.</div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Región/Dirección</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow
                  key={user.user_id || user.id || user.email} // Preferir ID del backend
                  user={{
                    ...user,
                    id: user.user_id || user.id // Normalizamos ID para el componente UserRow
                  }}
                  onDelete={() => handleDeleteUser(user.user_id || user.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;