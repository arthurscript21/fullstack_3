import React, { useState } from "react";
import { apiAddProducto } from "../../utils/apiHelperProducto";
import { useNavigate } from "react-router-dom";

function AdminAddProduct() {
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombreProducto: "",
    precio: "",
    detalle: "",
    stock: "",
    stockCritico: "",
    url: "",
    categoriaId: ""   // ← AGREGADO
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!producto.categoriaId) {
      alert("Debe ingresar un ID de categoría válido.");
      return;
    }

    // 🔥 ARMAR EL OBJETO QUE ESPERA EL BACKEND
    const payload = {
      nombreProducto: producto.nombreProducto,
      precio: producto.precio,
      detalle: producto.detalle,
      stock: producto.stock,
      stockCritico: producto.stockCritico,
      url: producto.url,
      categoria: {
        categoriaId: producto.categoriaId   // ← AQUÍ SE ENVÍA AL BACKEND
      }
    };

    try {
      setLoading(true);
      await apiAddProducto(payload);
      alert("Producto agregado exitosamente");
      navigate("/admin/productos");
    } catch (err) {
      alert("Error al agregar producto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 p-4 rounded shadow" style={{ maxWidth: "600px", background: "white" }}>
      <h2 className="text-center mb-4 fw-bold">Agregar Nuevo Producto</h2>

      <form onSubmit={handleSubmit}>

        {/* NOMBRE */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombre del Producto *</label>
          <input
            type="text"
            className="form-control"
            name="nombreProducto"
            value={producto.nombreProducto}
            onChange={handleChange}
            required
          />
        </div>

        {/* PRECIO */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Precio *</label>
          <input
            type="number"
            className="form-control"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            required
          />
        </div>

        {/* DETALLE */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Descripción</label>
          <textarea
            className="form-control"
            name="detalle"
            rows="3"
            value={producto.detalle}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* STOCK */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Stock *</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={producto.stock}
            onChange={handleChange}
            required
          />
        </div>

        {/* STOCK CRÍTICO */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Stock Crítico *</label>
          <input
            type="number"
            className="form-control"
            name="stockCritico"
            value={producto.stockCritico}
            onChange={handleChange}
            required
          />
        </div>

        {/* URL IMAGEN */}
        <div className="mb-3">
          <label className="form-label fw-semibold">URL de Imagen</label>
          <input
            type="text"
            className="form-control"
            name="url"
            value={producto.url}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        {/* ID CATEGORÍA */}
        <div className="mb-3">
          <label className="form-label fw-semibold">ID Categoria *</label>
          <input
            type="number"
            className="form-control"
            name="categoriaId"
            value={producto.categoriaId}
            onChange={handleChange}
            required
          />
        </div>

        {/* BOTONES */}
        <div className="d-flex justify-content-between mt-4">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate("/admin/productos")}
          >
            Cancelar
          </button>

          <button 
            type="submit" 
            className="btn btn-primary px-4"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminAddProduct;
