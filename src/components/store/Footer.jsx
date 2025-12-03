// src/components/store/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="footer-title">HuertoHogar</h5>
            <p>Frescura y calidad del campo directamente a tu puerta.</p>
          </div>

          <div className="col-md-4 mb-3">
            <h5 className="footer-title">Enlaces</h5>
            <ul className="list-unstyled">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
              {/* Link de prueba de seguridad */}
              <li><Link to="/admin" className="text-muted small">Acceso Administrativo</Link></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5 className="footer-title">Contacto</h5>
            <p className="mb-1">Email: info@huertohogar.cl</p>
            <p className="mb-0">Teléfono: +56 2 2345 6789</p>
          </div>
        </div>
        <div className="text-center mt-4 border-top border-secondary pt-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} HuertoHogar. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;