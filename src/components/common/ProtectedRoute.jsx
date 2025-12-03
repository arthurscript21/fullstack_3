// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getLoggedInUser } from '../../utils/localStorageHelper';

function ProtectedRoute({ children }) {
  const user = getLoggedInUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (user.role || user.rol || '').toLowerCase();

  // Permite acceso a Admin y Vendedor
  if (userRole !== 'admin' && userRole !== 'vendedor') {
    return <Navigate to="/" replace />;
  }

  return children;
}
export default ProtectedRoute;