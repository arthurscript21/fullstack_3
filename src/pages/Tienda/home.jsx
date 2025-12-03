// src/pages/Tienda/home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/store/ProductCard';
// CAMBIO: Importar la función de la API
import { apiGetProductos } from '../../utils/apiHelperProducto';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Llamada a la API
        const data = await apiGetProductos();
        
        // Mezclar y tomar 4 al azar (lógica frontend)
        if (data && data.length > 0) {
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setFeaturedProducts(shuffled.slice(0, 4));
        } else {
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-white text-center mb-5" style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '10px',
          padding: '100px 0'
      }}>
        <div className="container">
          <h1 className="display-4 fw-bold">Bienvenido a HuertoHogar</h1>
          <p className="lead">Frescura y calidad del campo directamente a tu puerta.</p>
          <Link to="/productos" className="btn btn-primary btn-lg mt-3">Ver Productos</Link>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className="py-5 bg-pattern">
          <div className="container">
              <h2 className="text-center section-title mb-4">Nuestras Categorías</h2>
              <div className="row">
                  {/* ... (Las tarjetas de categorías se mantienen igual, son estáticas por ahora) ... */}
                  {/* Puedes dejarlas como estaban en tu código original o dinámica si quieres */}
                  <div className="col-lg-3 col-md-6 mb-4">
                      <div className="card text-center h-100">
                          <img src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" className="card-img-top" alt="Frutas" style={{ height: '150px', objectFit: 'cover' }}/>
                          <div className="card-body d-flex flex-column">
                              <h5 className="card-title">Frutas</h5>
                              <Link to="/categoria/frutas" className="btn btn-sm btn-outline-primary mt-auto">Ver Frutas</Link>
                          </div>
                      </div>
                  </div>
                  {/* ... Repetir para otras categorías ... */}
              </div>
          </div>
      </section>

      {/* Productos Destacados (API) */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center section-title mb-4">Productos Destacados</h2>
          
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-success" role="status"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {featuredProducts.length > 0 ? (
                // ADAPTADOR: ProductCard espera propiedades específicas
                featuredProducts.map(p => (
                  <ProductCard key={p.producto_id || p.id} product={{
                    id: p.producto_id || p.id,
                    nombre: p.nombreProducto || p.nombre,
                    precio: p.precio,
                    stock: p.stock,
                    imagen: p.url || p.imagen,
                    categoria: p.categoria?.nombreCategoria || 'General' // Ajuste según tu API
                  }} />
                ))
              ) : (
                <p className="text-center col-12">No hay productos destacados disponibles.</p>
              )}
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/productos" className="btn btn-outline-primary">Ver Todos los Productos</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;