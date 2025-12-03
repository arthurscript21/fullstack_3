// src/pages/Tienda/Productos.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
// CAMBIO: Usar API
import { apiGetProductos } from '../../utils/apiHelperProducto';
import ProductCard from '../../components/store/ProductCard';

function Productos() {
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar productos de la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiGetProductos();
        
        // Mapear datos de la API al formato que usa el frontend si es necesario
        const mappedData = data.map(p => ({
          id: p.producto_id || p.id,
          nombre: p.nombreProducto || p.nombre,
          precio: p.precio,
          stock: p.stock,
          imagen: p.url || p.imagen,
          descripcion: p.detalle || p.descripcion,
          // Si la API devuelve objeto categoría, extrae el nombre
          categoria: (p.categoria?.nombreCategoria || p.categoria || '').toLowerCase()
        }));

        setAllProducts(mappedData);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 2. Filtrar cuando cambian los productos, la categoría o la búsqueda
  useEffect(() => {
    if (loading) return;

    let result = allProducts;

    // Filtro Categoría
    if (categoryName) {
      result = result.filter(p => 
        p.categoria && p.categoria.includes(categoryName.toLowerCase())
      );
    }

    // Filtro Búsqueda
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(lowerSearch) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredProducts(result);
  }, [allProducts, categoryName, searchTerm, loading]);


  return (
    <div className="px-md-4 py-5">
      <h2 className="text-center mb-4 section-title">
        {categoryName ? `Categoría: ${categoryName.toUpperCase()}` : 'Todos Nuestros Productos'}
      </h2>

      {/* Buscador simple visual */}
      <div className="row mb-4 justify-content-center">
        <div className="col-md-6">
           {/* Este input podría conectarse a un estado para búsqueda en tiempo real si quisieras */}
           <input type="text" className="form-control" placeholder="Filtrar vista actual..." disabled readOnly value={searchTerm ? `Filtrando por: ${searchTerm}` : ''} />
        </div>
      </div>

      {loading ? (
        <p className="text-center">Cargando catálogo...</p>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h4>No se encontraron productos</h4>
              <Link to="/productos" className="btn btn-outline-primary mt-2">
                Ver Todo
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Productos;