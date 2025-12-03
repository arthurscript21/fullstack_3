// src/components/admin/DashboardCard.jsx
import React from 'react';

function DashboardCard({ title, value, icon, color }) {
  // Nota: 'color' se usaba antes para bg-bootstrap, ahora usamos CSS personalizado.
  // Mantenemos la estructura limpia.
  
  return (
    <div className="dashboard-card">
      <div>
        <h3 className="card-title">{title}</h3>
        <p className="card-value">
           {value}
        </p>
      </div>
      {/* Si pasas un icono, se renderiza aquí */}
      <div style={{ fontSize: '2rem', opacity: 0.2, color: 'var(--verde-principal)' }}>
        {icon}
      </div>
    </div>
  );
}

export default DashboardCard;