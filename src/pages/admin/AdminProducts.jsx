// src/pages/admin/AdminProducts.jsx - CORREGIDO
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

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const productos = await apiGetProductos();
      setProducts(productos);
    } catch (err) {
      setError('Error al cargar productos: ' + err.message);
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      console.log("Producto a actualizar desde frontend:", updatedProduct);
      
      // Mapear los campos correctamente
      const productoParaBackend = {
        producto_id: parseInt(updatedProduct.id || updatedProduct.producto_id),
        nombreProducto: updatedProduct.nombre,
        precio: parseInt(updatedProduct.precio),
        detalle: updatedProduct.descripcion || `Descripción de ${updatedProduct.nombre}`,
        stock: parseInt(updatedProduct.stock),
        stockCritico: parseInt(updatedProduct.stockCritico || 10),
        url: updatedProduct.imagen || ''
      };

      console.log("Producto mapeado para backend:", productoParaBackend);

      const result = await apiUpdateProducto(productoParaBackend);
      
      if (result && (result.producto_id || result.success)) {
        // Recargar los productos para asegurar consistencia
        await loadProducts();
        alert('Producto actualizado exitosamente!');
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
      
    } catch (err) {
      console.error("Error completo al actualizar:", err);
      alert(`Error al actualizar el producto: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) {
      return;
    }

    try {
      await apiDeleteProducto(productId);
      // Recargar los productos después de eliminar
      await loadProducts();
      alert('Producto eliminado exitosamente!');
    } catch (err) {
      alert('Error al eliminar el producto: ' + err.message);
      console.error("Error deleting product:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
        <p className="text-center mt-2">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={loadProducts}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">
          Añadir Producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="alert alert-info">
          No hay productos disponibles. 
          <Link to="/admin/productos/nuevo" className="btn btn-sm btn-info ms-2">
            Crear primer producto
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Stock Crítico</th>
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