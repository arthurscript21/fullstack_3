// src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductRow from '../../components/admin/ProductRow';
import { apiGetProductos, apiUpdateProducto, apiDeleteProducto } from '../../utils/apiHelperProducto';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiGetProductos();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSaveProduct = async (updatedProduct) => {
    try {
      // Mapeo para enviar al backend
      const payload = {
        producto_id: parseInt(updatedProduct.id || updatedProduct.producto_id),
        nombreProducto: updatedProduct.nombre,
        precio: parseInt(updatedProduct.precio),
        detalle: updatedProduct.detalle || updatedProduct.descripcion || '',
        stock: parseInt(updatedProduct.stock),
        stockCritico: parseInt(updatedProduct.stockCritico || 10),
        url: updatedProduct.imagen || ''
      };
      await apiUpdateProducto(payload);
      alert('Producto actualizado.');
      loadProducts();
    } catch (err) {
      alert('Error al actualizar: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    // ProductRow ya pide confirmación, pero aseguramos
    try {
      await apiDeleteProducto(id);
      alert('Producto eliminado.');
      loadProducts();
    } catch (err) {
      alert('Error al eliminar.');
    }
  };

  if (loading) return <div className="p-4">Cargando productos...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">Añadir Producto</Link>
      </div>

      <div className="table-container">
        {products.length === 0 ? (
          <p className="p-3 text-muted">No hay productos disponibles.</p>
        ) : (
          <table className="admin-table">
            <thead>
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
        )}
      </div>
    </div>
  );
}

export default AdminProducts;