// src/pages/Tienda/Perfil.jsx (MODIFICADO)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getLoggedInUser, logoutUser, saveLoggedInUser, dispatchStorageUpdate } from '../../utils/localStorageHelper';
// --- CAMBIO: Importar helpers de la API ---
import { fetchAllUsers, updateExistingUser } from '../../utils/apiHelper'; //
// ------------------------------------------

function Perfil() {
  const [user, setUser] = useState(null);
  // ... (otros estados sin cambios)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', direccion: '' }); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Carga los datos del usuario al iniciar (desde la API)
  useEffect(() => {
    const loadUserData = async () => {
      const loggedInUser = getLoggedInUser();
      if (!loggedInUser) { navigate('/login?redirect=/perfil'); setLoading(false); return; }

      // --- CAMBIO: Buscar en la API ---
      const users = await fetchAllUsers(); //
      const detailedUser = users.find(u => u.correo === loggedInUser.email); // Usar 'correo'
      // --------------------------------

      const currentUser = detailedUser || loggedInUser;
      
      if (currentUser.correo && currentUser.nombreCompleto) { // Verifica si el detalle de la API es válido
         setUser({
            id: currentUser.user_id || currentUser.id, // Usar user_id
            nombre: currentUser.nombreCompleto || currentUser.nombre,
            email: currentUser.correo || currentUser.email,
            telefono: currentUser.telefono || '',
            direccion: currentUser.direccion || '',
            rol: currentUser.rol || 'Cliente'
        });

        setFormData({
            nombre: currentUser.nombreCompleto || currentUser.nombre || '',
            telefono: currentUser.telefono || '',
            direccion: currentUser.direccion || ''
        });
      } else {
           // Fallback si la API no devuelve los detalles completos
           setUser(loggedInUser);
           setFormData({ nombre: loggedInUser.nombre || '', telefono: '', direccion: '' });
      }
      setLoading(false);
    };

    loadUserData();
  }, [navigate]);

  // ... (handleInputChange, handleEditToggle sin cambios) ...

  const handleSave = async () => { // <-- CAMBIO: Hacemos la función asíncrona
    if (!user) return; 

    if (!formData.nombre.trim()) { alert('El nombre no puede estar vacío.'); return; }

    // Objeto mapeado a la Entity de Spring Boot (Usuarios.java)
    const dataToUpdate = {
      user_id: user.id, // ID del usuario (clave primaria)
      nombreCompleto: formData.nombre.trim(),
      correo: user.email, // NO editable
      contrasena: user.contrasena || 'placeholder', // Se necesita un valor
      direccion: formData.direccion.trim(),
      telefono: formData.telefono.trim(),
      rol: user.rol, // NO editable
      comuna: user.comuna || 'N/A',
      region: user.region || 'N/A'
    };

    // --- CAMBIO: Llamar a la API en lugar de actualizar lista local ---
    const result = await updateExistingUser(dataToUpdate); //

    if (result.success) {
        const updatedUserFromApi = result.user;
        // 1. Actualiza el estado local (usando datos de la API)
        setUser({
            ...user, // Mantiene los datos del frontend (contraseña)
            nombre: updatedUserFromApi.nombreCompleto,
            telefono: updatedUserFromApi.telefono,
            direccion: updatedUserFromApi.direccion,
        });

        // 2. Actualiza la información de la SESIÓN ACTIVA (USER_KEY)
        const updatedLoggedInUser = {
            ...getLoggedInUser(),
            nombre: updatedUserFromApi.nombreCompleto 
        };
        saveLoggedInUser(updatedLoggedInUser); 

        setIsEditing(false);
        alert('Perfil actualizado con éxito.');
        dispatchStorageUpdate();
    } else {
        alert(`Error al actualizar perfil: ${result.message}`);
    }
    // -----------------------------------------------------------------
  };

  // ... (handleLogout, JSX de renderizado sin cambios) ...

  if (loading) return <div className="px-md-4 px-3 py-5 text-center">Cargando perfil...</div>;
  if (!user) return null;

  return (
    <div className="px-md-4 px-3 py-5">
      <h2 className="text-center mb-4 section-title">Mi Perfil</h2>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4 p-md-5">
              {isEditing ? (
                <>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                    <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                     <label htmlFor="telefono" className="form-label">Teléfono</label>
                     <input type="tel" className="form-control" id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="+569xxxxxxxx"/>
                   </div>
                   <div className="mb-3">
                     <label htmlFor="direccion" className="form-label">Dirección</label>
                     <textarea className="form-control" id="direccion" name="direccion" rows="3" value={formData.direccion} onChange={handleInputChange} placeholder="Calle, Número, Comuna, Ciudad..."></textarea>
                   </div>
                   <p className="small text-muted mb-4">Email: {user.email} (No editable)</p>
                   <div className="d-flex justify-content-end gap-2 mt-4">
                     <button className="btn btn-secondary" onClick={handleEditToggle}>Cancelar</button>
                     <button className="btn btn-primary" onClick={handleSave}>Guardar Cambios</button>
                   </div>
                </>
              ) : (
                <>
                  <p><strong>Nombre:</strong> {user.nombre}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Teléfono:</strong> {user.telefono || 'No especificado'}</p>
                  <p><strong>Dirección:</strong> {user.direccion || 'No especificada'}</p>
                  <button className="btn btn-outline-primary mt-3" onClick={handleEditToggle}>
                    Editar Información
                  </button>
                  <hr className="my-4" />
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                   <div className="mt-3 text-center">
                        <Link to="/" className="btn btn-sm btn-link">← Volver a la tienda</Link>
                   </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Perfil;