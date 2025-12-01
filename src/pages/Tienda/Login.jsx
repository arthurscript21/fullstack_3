// src/pages/Tienda/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { saveLoggedInUser, getLoggedInUser, dispatchStorageUpdate } from '../../utils/localStorageHelper';
import { fetchUserByEmail } from '../../utils/apiHelper';

const adminCredenciales = { email: "admin@correo.com", password: "Admin123" };

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  // Si el usuario ya está logueado, redirigir
  useEffect(() => {
    if (getLoggedInUser()) {
      navigate(redirectPath === '/admin' ? '/' : redirectPath, { replace: true });
    }
  }, [navigate, redirectPath]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, ingresa correo y contraseña.');
      return;
    }

    // 1. Verificar Admin Hardcodeado
    if (email === adminCredenciales.email && password === adminCredenciales.password) {
      const adminUser = { nombre: 'Administrador', email: adminCredenciales.email, role: 'admin' };
      saveLoggedInUser(adminUser);
      dispatchStorageUpdate();
      alert('Inicio de sesión como Administrador exitoso.');
      navigate('/admin');
      return;
    }

    // 2. Verificar usuario con la API
    let userData = await fetchUserByEmail(email);

    if (!userData) {
      setError("Usuario no encontrado.");
      return;
    }

    // --- Ajuste universal de nombres de campos ---
    const userEmail = userData.correo ?? userData.email ?? userData.mail ?? null;
    const userPassword = userData.contrasena ?? userData.password ?? userData.pass ?? null;
    const userName = userData.nombreCompleto ?? userData.nombre ?? userData.username ?? "Usuario";
    const userRole = userData.rol ?? userData.role ?? "user";
    const userId = userData.user_id ?? userData.id ?? null;

    // Validar que vengan los campos básicos
    if (!userEmail || !userPassword) {
      setError("El usuario obtenido del servidor no trae correo o contraseña.");
      return;
    }

    // Validar contraseña
    if (userPassword !== password) {
      setError('Correo o contraseña incorrectos.');
      return;
    }

    // Crear objeto limpio para guardar
    const userToSave = {
      id: userId,
      nombre: userName,
      email: userEmail,
      role: userRole === "Admin" ? "admin" : "user"
    };

    saveLoggedInUser(userToSave);
    dispatchStorageUpdate();
    alert(`Inicio de sesión exitoso. ¡Bienvenido ${userToSave.nombre}!`);

    navigate(redirectPath === '/admin' ? '/' : redirectPath, { replace: true });
  };

  return (
    <div className="px-md-4 px-3 py-5 d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 116px)' }}>
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="passwordInput" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">Iniciar Sesión</button>
              </form>

              <div className="text-center">
                <p className="mb-2">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
                <Link to="/">← Volver al inicio</Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
