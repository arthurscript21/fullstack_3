// src/pages/Tienda/DetalleProducto.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCart, saveCart, getLoggedInUser, dispatchStorageUpdate } from '../../utils/localStorageHelper';
// CAMBIO: API para detalle
import { apiGetProductoById } from '../../utils/apiHelperProducto';

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Llamada a la API
        const data = await apiGetProductoById(id);
        
        // Mapear
        if (data) {
          setProduct({
            id: data.producto_id || data.id,
            nombre: data.nombreProducto || data.nombre,
            precio: data.precio,
            stock: data.stock,
            imagen: data.url || data.imagen,
            descripcion: data.detalle || data.descripcion,
            categoria: data.categoria?.nombreCategoria || 'General'
          });
        }
      } catch (error) {
        console.error("Error al cargar producto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAddToCart = () => {
    if (!getLoggedInUser()) {
        if(window.confirm('Debes iniciar sesión para comprar. ¿Ir al login?')) {
            navigate(`/login?redirect=/productos/${id}`);
        }
        return;
    }
    if (!product) return;

    let cart = getCart();
    const idx = cart.findIndex(i => i.id === product.id);
    
    if (idx > -1) {
        // Actualizar existente
        const current = cart[idx];
        const newQty = (current.cantidad || 0) + quantity;
        if (newQty > product.stock) {
            alert(`No puedes añadir más. Stock máximo: ${product.stock}`);
            current.cantidad = product.stock;
        } else {
            current.cantidad = newQty;
        }
    } else {
        // Añadir nuevo
        cart.push({
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            imagen: product.imagen,
            cantidad: quantity,
            precioActual: product.precio
        });
    }
    
    saveCart(cart);
    dispatchStorageUpdate();
    alert(`${quantity} ${product.nombre} agregado(s)!`);
  };

  if (loading) return <div className="py-5 text-center">Cargando...</div>;
  
  if (!product) {
    return (
      <div className="py-5 text-center">
        <h2>Producto no encontrado</h2>
        <Link to="/productos" className="btn btn-primary">Volver a Productos</Link>
      </div>
    );
  }

  const formatPrice = (price) => new Intl.NumberFormat('es-CL', {style:'currency', currency:'CLP'}).format(price);

  return (
    <div className="px-md-4 px-3 py-5">
      <div className="row">
        <div className="col-md-6 mb-4">
            <img 
                src={product.imagen || 'https://via.placeholder.com/600x400?text=No+Imagen'} 
                className="img-fluid rounded border shadow-sm" 
                alt={product.nombre} 
                style={{maxHeight:'400px', width:'100%', objectFit:'contain'}}
            />
        </div>

        <div className="col-md-6">
          <h2>{product.nombre}</h2>
          <p className="product-price fs-3 fw-bold text-success mb-3">{formatPrice(product.precio)}</p>
          <p className="text-muted">{product.descripcion}</p>
          <p className="mb-2"><strong>Categoría:</strong> {product.categoria}</p>
          <p className="mb-3"><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} disponibles` : <span className="text-danger">Agotado</span>}</p>

          {product.stock > 0 && (
             <div className="d-flex gap-2 align-items-center mb-4">
                <input 
                    type="number" 
                    className="form-control" 
                    value={quantity} 
                    min="1" 
                    max={product.stock} 
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value)||1)))}
                    style={{width:'80px'}}
                />
                <button className="btn btn-primary flex-grow-1" onClick={handleAddToCart}>
                    Añadir al Carrito
                </button>
             </div>
          )}
          
          <Link to="/productos" className="btn btn-outline-secondary">Volver</Link>
        </div>
      </div>
    </div>
  );
}
export default DetalleProducto;