// src/pages/admin/AdminCategories.jsx
import React, { useEffect, useState } from "react";
import {
  apiGetCategories,
  apiAddCategory,
  apiDeleteCategory,
  apiUpdateCategory,
} from "../../utils/apiHelperCategoria";

const AdminCategories = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar categorías al iniciar
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    const data = await apiGetCategories();
    setCategorias(data || []);
    setLoading(false);
  };

  // Agregar nueva categoría
  const handleAgregar = async () => {
    if (!nuevoNombre.trim()) return;
    
    const success = await apiAddCategory({ nombreCategoria: nuevoNombre });
    if (success) {
      setNuevoNombre("");
      cargarCategorias();
    } else {
      alert("Error al agregar categoría (Verifique conexión API)");
    }
  };

  // Eliminar categoría
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    
    const success = await apiDeleteCategory(id);
    if (success) {
      cargarCategorias();
    } else {
      alert("Error al eliminar categoría");
    }
  };

  // Modo edición
  const iniciarEdicion = (categoria) => {
    setEditandoId(categoria.categoriaId);
    setNombreEditado(categoria.nombreCategoria);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombreEditado("");
  };

  const guardarEdicion = async (id) => {
    if (!nombreEditado.trim()) return;
    
    const success = await apiUpdateCategory(id, { nombreCategoria: nombreEditado });
    if (success) {
      cancelarEdicion();
      cargarCategorias();
    } else {
      alert("Error al actualizar categoría");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4 text-center">Gestión de Categorías</h2>

      {/* Panel Agregar */}
      <div className="card p-4 mb-4 shadow-sm">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nueva categoría..."
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleAgregar} disabled={loading}>
            Agregar
          </button>
        </div>
      </div>

      {/* Lista */}
      {loading ? <p className="text-center">Cargando...</p> : (
        <ul className="list-group shadow-sm">
          {categorias.length === 0 ? (
            <li className="list-group-item text-center text-muted">No se encontraron categorías.</li>
          ) : (
            categorias.map((c) => (
              <li key={c.categoriaId} className="list-group-item d-flex justify-content-between align-items-center">
                {editandoId === c.categoriaId ? (
                  <div className="d-flex w-100 gap-2">
                    <input
                      type="text"
                      className="form-control"
                      value={nombreEditado}
                      onChange={(e) => setNombreEditado(e.target.value)}
                    />
                    <button className="btn btn-sm btn-primary" onClick={() => guardarEdicion(c.categoriaId)}>Guardar</button>
                    <button className="btn btn-sm btn-secondary" onClick={cancelarEdicion}>Cancelar</button>
                  </div>
                ) : (
                  <>
                    <span className="fw-medium">{c.nombreCategoria}</span>
                    <div>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => iniciarEdicion(c)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(c.categoriaId)}>Eliminar</button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default AdminCategories;