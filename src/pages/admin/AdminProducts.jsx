import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductRow from '../../components/admin/ProductRow';
import { apiGetProductos, apiUpdateProducto, apiDeleteProducto } from '../../utils/apiHelperProducto';
import { getLoggedInUser } from '../../utils/localStorageHelper';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verificar rol
  const user = getLoggedInUser();
  const isVendedor = (user?.role || user?.rol || '').toLowerCase() === 'vendedor';

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

  useEffect(() => { loadProducts(); }, []);

  const handleSaveProduct = async (updatedProduct) => {
    try {
      const payload = {
        producto_id: parseInt(updatedProduct.id || updatedProduct.producto_id),
        nombreProducto: updatedProduct.nombre,
        precio: parseInt(updatedProduct.precio),
        detalle: updatedProduct.detalle || '',
        stock: parseInt(updatedProduct.stock),
        stockCritico: parseInt(updatedProduct.stockCritico || 10),
        url: updatedProduct.imagen || ''
      };
      await apiUpdateProducto(payload);
      alert('Producto actualizado.');
      loadProducts();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await apiDeleteProducto(id);
      alert('Producto eliminado.');
      loadProducts();
    } catch (err) { alert('Error al eliminar.'); }
  };

  if (loading) return <div className="p-4">Cargando...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Productos</h1>
        {!isVendedor && (
          <Link to="/admin/productos/nuevo" className="btn btn-primary">Añadir Producto</Link>
        )}
      </div>

      <div className="table-responsive">
        <table className="admin-table table table-striped">
          <thead>
            <tr>
              <th>Img</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>S. Crítico</th><th>Acciones</th>
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
                readOnly={isVendedor} // Bloqueo de acciones
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default AdminProducts;