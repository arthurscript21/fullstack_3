// src/pages/Tienda/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { saveLoggedInUser, getLoggedInUser, dispatchStorageUpdate, getUsersList } from '../../utils/localStorageHelper';
import { fetchUserByEmail } from '../../utils/apiHelper';

const adminCredenciales = { email: "admin@correo.com", password: "Admin123" };

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (getLoggedInUser()) {
      navigate(redirectPath === '/admin' ? '/' : redirectPath, { replace: true });
    }
  }, [navigate, redirectPath]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) { setError('Faltan datos.'); return; }

    // 1. Admin Hardcodeado
    if (email === adminCredenciales.email && password === adminCredenciales.password) {
      saveLoggedInUser({ nombre: 'Administrador', email, role: 'admin' });
      dispatchStorageUpdate();
      navigate('/admin');
      return;
    }

    let userData = null;
    try { userData = await fetchUserByEmail(email); } catch (e) {}
    if (!userData) { userData = getUsersList().find(u => u.email === email); }

    if (!userData) { setError("Usuario no encontrado."); return; }

    const userPass = userData.contrasena || userData.password;
    if (userPass !== password) { setError('Contraseña incorrecta.'); return; }

    // Determinar Rol
    const roleRaw = (userData.rol || userData.role || 'cliente').toLowerCase();
    let finalRole = 'cliente';
    if (roleRaw.includes('admin')) finalRole = 'admin';
    if (roleRaw.includes('vendedor')) finalRole = 'vendedor';

    saveLoggedInUser({
      id: userData.user_id || userData.id,
      nombre: userData.nombreCompleto || userData.nombre,
      email: userData.email || userData.correo,
      role: finalRole
    });
    
    dispatchStorageUpdate();
    // Si es admin o vendedor, va al panel
    const isStaff = finalRole === 'admin' || finalRole === 'vendedor';
    navigate(isStaff ? '/admin' : '/');
  };

  return (
    <div className="px-md-4 px-3 py-5 d-flex justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow p-5" style={{maxWidth: '500px', width: '100%'}}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3"><label>Correo</label><input type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} required /></div>
          <div className="mb-4"><label>Contraseña</label><input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} required /></div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
        <div className="text-center mt-3"><Link to="/registro">Crear Cuenta</Link></div>
        <div className="text-center mt-3"><Link to="/">← Volver al inicio</Link></div>
      </div>
    </div>
  );
}
export default Login;