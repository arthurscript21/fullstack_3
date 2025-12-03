import React from 'react';
import { Navigate } from 'react-router-dom';
import { getLoggedInUser } from '../../utils/localStorageHelper';

function ProtectedRoute({ children }) {
  const user = getLoggedInUser();

  // 1. Si no hay usuario, al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Normalizar rol
  const userRole = (user.role || user.rol || '').toLowerCase();

  // 3. Permitir ADMIN y VENDEDOR
  if (userRole !== 'admin' && userRole !== 'vendedor') {
    return <Navigate to="/" replace />;
  }

  // 4. Acceso concedido
  return children;
}

export default ProtectedRoute;