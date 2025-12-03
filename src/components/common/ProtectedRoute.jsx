// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getLoggedInUser } from '../../utils/localStorageHelper'; // Usamos el helper para ver la sesión actual

function ProtectedRoute({ children }) {
  const user = getLoggedInUser();

  // 1. Si no hay usuario logueado, redirigir al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Normalizar el rol para aceptar "Admin", "admin", "ADMIN", etc.
  const userRole = (user.role || user.rol || '').toLowerCase();

  // 3. Si el rol NO es admin, redirigir al inicio de la tienda
  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 4. Si es admin, permitir el acceso a la ruta hija
  return children;
}

export default ProtectedRoute;