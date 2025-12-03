// src/pages/admin/EditUser.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchAllUsers, updateExistingUser } from '../../utils/apiHelper'; // Importar API helper

function EditUser() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    region: '',
    rol: 'Cliente',
  });
  const [originalUser, setOriginalUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const users = await fetchAllUsers();
        // Buscar por user_id o id
        const userToEdit = users.find(u => (u.user_id == userId) || (u.id == userId));

        if (userToEdit) {
          setOriginalUser(userToEdit);
          setFormData({
            nombre: userToEdit.nombreCompleto || userToEdit.nombre || '',
            correo: userToEdit.correo || userToEdit.email || '',
            telefono: userToEdit.telefono || '',
            region: userToEdit.direccion || '',
            rol: userToEdit.rol || 'Cliente',
          });
        } else {
          setError('Usuario no encontrado.');
        }
      } catch (e) {
        setError('Error cargando usuario.');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefono') {
      let phoneValue = value;
      if (!phoneValue.startsWith('+569')) { phoneValue = '+569'; }
      const numbers = phoneValue.substring(4).replace(/\D/g, '');
      setFormData(prev => ({ ...prev, telefono: '+569' + numbers.substring(0, 8) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre || !formData.region || !formData.rol) {
      setError('Nombre, Región y Rol son obligatorios.');
      return;
    }
    if (formData.telefono && formData.telefono.length !== 12) {
        setError('El teléfono debe tener el formato +569XXXXXXXX o estar vacío.');
        return;
    }

    try {
      const dataToUpdate = {
        user_id: originalUser.user_id || originalUser.id,
        nombreCompleto: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.region,
        rol: formData.rol,
        correo: originalUser.correo, // No cambia
        // Se envía password original o placeholder si el backend lo requiere
        contrasena: originalUser.contrasena || 'placeholder' 
      };

      const result = await updateExistingUser(dataToUpdate);

      if (result.success) {
        alert('Usuario actualizado exitosamente!');
        navigate('/admin/usuarios');
      } else {
        setError('Error al actualizar: ' + result.message);
      }

    } catch (err) {
      setError('Error de conexión.');
      console.error(err);
    }
  };

  if (loading) return <p>Cargando datos del usuario...</p>;
  if (error && !originalUser) return <div className="alert alert-danger">{error} <Link to="/admin/usuarios">Volver</Link></div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <h1>Editar Usuario</h1>
      <hr />

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {error && <div className="alert alert-danger">{error}</div>}

        <fieldset className="mb-3">
          <legend className="fs-5 mb-3">Datos personales</legend>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre completo</label>
            <input type="text" id="nombre" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">Correo electrónico</label>
            <input type="email" id="correo" name="correo" className="form-control" value={formData.correo} readOnly disabled />
            <small className="form-text text-muted">El correo no se puede modificar.</small>
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input type="tel" id="telefono" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} maxLength="12" />
          </div>
          <div className="mb-3">
            <label htmlFor="region" className="form-label">Región</label>
            <select id="region" name="region" className="form-select" value={formData.region} onChange={handleChange} required>
              <option value="">Seleccione una región</option>
              <option value="metropolitana">Metropolitana de Santiago</option>
              <option value="valparaiso">Valparaíso</option>
              {/* ... resto de regiones ... */}
            </select>
          </div>
        </fieldset>

        {/* SECCIÓN DE ROL MODIFICADA */}
        <fieldset className="mb-4">
          <legend className="fs-5 mb-3">Rol</legend>
          <div className="mb-3">
            <label htmlFor="rol" className="form-label">Seleccione Rol</label>
            <select id="rol" name="rol" className="form-select" value={formData.rol} onChange={handleChange} required>
              <option value="Cliente">Cliente</option>
              <option value="Admin">Administrador</option>
              <option value="Vendedor">Vendedor</option> {/* NUEVA OPCIÓN */}
            </select>
          </div>
        </fieldset>

        <div className="d-flex justify-content-end gap-2">
          <Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;