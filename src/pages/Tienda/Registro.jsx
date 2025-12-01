// src/pages/Tienda/Registro.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLoggedInUser } from '../../utils/localStorageHelper';
import { createNewUser } from '../../utils/apiHelper'; 

function Registro() {
  const [nombreCompleto, setNombre] = useState('');
  const [correo, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('+569');
  const [region, setRegion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Si ya está logueado, redirigir a home
  useEffect(() => {
    if (getLoggedInUser()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Validación en tiempo real del teléfono
  const handleTelefonoChange = (e) => {
    let value = e.target.value;

    if (!value.startsWith('+569')) {
      value = '+569';
    }

    const numberPart = value.substring(4).replace(/\D/g, ''); 
    value = '+569' + numberPart.substring(0, 8);

    setTelefono(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (nombreCompleto.length === 0 || nombreCompleto.length > 25) {
      setError('El nombre debe tener entre 1 y 25 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@(duocuc\.cl|gmail\.com)$/;
    if (!emailRegex.test(correo)) {
      setError('Correo inválido. Solo se aceptan @duocuc.cl y @gmail.com.');
      return;
    }

    if (password.length < 7 || password.length > 12) {
      setError('La contraseña debe tener entre 7 y 12 caracteres.');
      return;
    }

    if (telefono.length !== 12) {
      setError('El teléfono debe tener el formato +569 seguido de 8 dígitos.');
      return;
    }

    if (!direccion) {
      setError('La dirección de entrega es obligatoria.');
      return;
    }

    if (!region) {
      setError('La región es obligatoria.');
      return;
    }

    // OBJETO JSON CORREGIDO PARA SPRING BOOT
    const newUser = {
      nombreCompleto,
      correo,
      password, // ✔ ESTE CAMPO DEBE LLAMARSE ASÍ PARA MATCH CON LA ENTITY
      direccion,
      telefono,
      region,
      comuna: 'N/A',
      rol: 'Cliente'
    };

    // Llamada a la API Spring Boot
    const result = await createNewUser(newUser);

    if (result.success) {
      setSuccess('¡Registro exitoso! Serás redirigido al inicio de sesión.');
      
      setNombre('');
      setEmail('');
      setPassword('');
      setDireccion('');
      setTelefono('+569');
      setRegion('');

      setTimeout(() => navigate('/login'), 2000);

    } else {
      setError(`Error al registrar: ${result.message || 'Intenta con otro correo.'}`);
    }
  };

  return (
    <div className="px-md-4 py-5 d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 116px)' }}>
      <div className="row justify-content-center w-100">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">Crear Cuenta</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>

                {/* Nombre */}
                <div className="mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombreCompleto}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    maxLength="25"
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    value={correo}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="form-text">Solo @duocuc.cl y @gmail.com.</div>
                </div>

                {/* Contraseña */}
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="7"
                    maxLength="12"
                  />
                </div>

                {/* Dirección */}
                <div className="mb-3">
                  <label className="form-label">Dirección de Entrega</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                  />
                </div>

                {/* Teléfono */}
                <div className="mb-3">
                  <label className="form-label">Teléfono de Contacto</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={telefono}
                    onChange={handleTelefonoChange}
                    required
                    maxLength="12"
                  />
                  <div className="form-text">Formato: +569 seguido de 8 dígitos.</div>
                </div>

                {/* Región */}
                <div className="mb-4">
                  <label className="form-label">Región</label>
                  <select
                    className="form-select"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    required
                  >
                    <option value="">Seleccione una región</option>
                    <option value="metropolitana">Metropolitana de Santiago</option>
                    <option value="valparaiso">Valparaíso</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">Registrarse</button>

              </form>

              <div className="text-center mt-3">
                <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
              </div>

              <div className="text-center mt-3">
                <Link to="/">← Volver al inicio</Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
