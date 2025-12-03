// src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductRow from '../../components/admin/ProductRow';
import { 
  apiGetProductos, 
  apiUpdateProducto, 
  apiDeleteProducto 
} from '../../utils/apiHelperProducto';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiGetProductos();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
      setError('Error al cargar productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSaveProduct = async (updatedProduct) => {
    try {
      // Mapeo para asegurar que el backend reciba los tipos de datos correctos
      const productoParaBackend = {
        producto_id: parseInt(updatedProduct.id || updatedProduct.producto_id),
        nombreProducto: updatedProduct.nombre,
        precio: parseInt(updatedProduct.precio),
        detalle: updatedProduct.detalle || updatedProduct.descripcion || '',
        stock: parseInt(updatedProduct.stock),
        stockCritico: parseInt(updatedProduct.stockCritico || 10),
        url: updatedProduct.imagen || ''
      };

      const result = await apiUpdateProducto(productoParaBackend);
      
      if (result && (result.producto_id || result.success)) {
        alert('Producto actualizado exitosamente!');
        loadProducts(); // Recargar lista
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error("Error updating:", err);
      alert(`Error al actualizar: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) return;

    try {
      await apiDeleteProducto(productId);
      alert('Producto eliminado exitosamente!');
      loadProducts();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  if (loading) return <div className="p-4 text-center">Cargando productos...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">
          Añadir Producto
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error} 
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={loadProducts}>Reintentar</button>
        </div>
      )}

      {products.length === 0 && !error ? (
        <div className="alert alert-info">No hay productos disponibles.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Img</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>S. Crítico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <ProductRow
                  key={product.producto_id}
                  product={{
                    id: product.producto_id,
                    producto_id: product.producto_id,
                    nombre: product.nombreProducto,
                    precio: product.precio,
                    stock: product.stock,
                    stockCritico: product.stockCritico,
                    imagen: product.url,
                    descripcion: product.detalle
                  }}
                  onSave={handleSaveProduct}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;