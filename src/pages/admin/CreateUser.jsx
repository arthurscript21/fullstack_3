// src/pages/admin/CreateUser.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewUser } from '../../utils/apiHelper'; 
import { getLoggedInUser } from '../../utils/localStorageHelper'; // Importar para validar permisos

function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '+569',
    region: '',
    clave: '',
    confirmar_clave: '',
    rol: 'Cliente', 
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- VALIDACIÓN DE SEGURIDAD: Vendedor no puede crear usuarios ---
  useEffect(() => {
    const currentUser = getLoggedInUser();
    const role = (currentUser?.role || currentUser?.rol || '').toLowerCase();
    
    // Si es vendedor, lo sacamos de aquí
    if (role === 'vendedor') {
      alert('Acceso denegado: Los vendedores solo tienen permisos de lectura.');
      navigate('/admin/usuarios');
    }
  }, [navigate]);
  // ----------------------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefono') {
        if (!value.startsWith('+569')) {
           setFormData(prev => ({ ...prev, telefono: '+569' + value.replace(/\D/g, '').substring(0, 8) }));
        } else {
             const numbers = value.substring(4).replace(/\D/g, '');
             setFormData(prev => ({ ...prev, telefono: '+569' + numbers.substring(0, 8) }));
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre || !formData.correo || !formData.region || !formData.rol || !formData.clave) {
      setError('Todos los campos son obligatorios.'); return;
    }
    const emailRegex = /^[^\s@]+@(duocuc\.cl|gmail\.com)$/;
    if (!emailRegex.test(formData.correo)) {
      setError('El correo debe ser @duocuc.cl o @gmail.com.'); return;
    }
     if (formData.telefono.length !== 12) {
      setError('El teléfono debe tener el formato +569XXXXXXXX.'); return;
    }
    if (formData.clave.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.'); return;
    }
    if (formData.clave !== formData.confirmar_clave) {
      setError('Las contraseñas no coinciden.'); return;
    }

    try {
      const newUser = {
        nombreCompleto: formData.nombre,
        correo: formData.correo,
        telefono: formData.telefono,
        direccion: formData.region,
        rol: formData.rol,
        password: formData.clave
      };

      const result = await createNewUser(newUser);

      if (result.success) {
        alert('Usuario creado exitosamente!');
        navigate('/admin/usuarios');
      } else {
        setError('Error al guardar el usuario: ' + result.message);
      }

    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <h1>Crear Nuevo Usuario</h1>
      <hr />
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {error && <div className="alert alert-danger">{error}</div>}

        <fieldset className="mb-3">
          <legend className="fs-5 mb-3">Datos personales</legend>
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input type="email" name="correo" className="form-control" value={formData.correo} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input type="tel" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} maxLength="12" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Región</label>
            <select name="region" className="form-select" value={formData.region} onChange={handleChange} required>
              <option value="">Seleccione una región</option>
              <option value="metropolitana">Metropolitana</option>
              <option value="valparaiso">Valparaíso</option>
              <option value="biobio">Biobío</option>
              <option value="araucania">La Araucanía</option>
              {/* Agrega más si necesitas */}
            </select>
          </div>
        </fieldset>

        <fieldset className="mb-3">
          <legend className="fs-5 mb-3">Seguridad</legend>
          <div className="mb-3 position-relative">
            <label className="form-label">Contraseña</label>
            <input type={showPassword ? "text" : "password"} name="clave" className="form-control" value={formData.clave} onChange={handleChange} required minLength="6" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn btn-outline-secondary btn-sm position-absolute end-0 top-50 translate-middle-y me-2" style={{marginTop:'12px'}}>Ver</button>
          </div>
          <div className="mb-3 position-relative">
            <label className="form-label">Confirmar contraseña</label>
            <input type={showConfirmPassword ? "text" : "password"} name="confirmar_clave" className="form-control" value={formData.confirmar_clave} onChange={handleChange} required minLength="6" />
             <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="btn btn-outline-secondary btn-sm position-absolute end-0 top-50 translate-middle-y me-2" style={{marginTop:'12px'}}>Ver</button>
          </div>
        </fieldset>

        <fieldset className="mb-4">
            <legend className="fs-5 mb-3">Rol</legend>
             <div className="mb-3">
                <label htmlFor="rol" className="form-label">Seleccione Rol</label>
                <select id="rol" name="rol" className="form-select" value={formData.rol} onChange={handleChange} required>
                  <option value="Cliente">Cliente</option>
                  <option value="Admin">Administrador</option>
                  <option value="Vendedor">Vendedor</option> {/* Opción habilitada */}
                </select>
             </div>
        </fieldset>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/admin/usuarios')}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar Usuario</button>
        </div>
      </form>
    </div>
  );
}
export default CreateUser;