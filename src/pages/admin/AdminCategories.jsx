import React, { useEffect, useState } from "react";
import {
  apiGetCategories,
  apiAddCategory,
  apiDeleteCategory,
  apiUpdateCategory,
} from "../../utils/apiHelperCategoria";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");

  // Cargar categorías al iniciar
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    const data = await apiGetCategories();
    setCategorias(data);
  };

  // Agregar nueva categoría
  const handleAgregar = async () => {
    if (!nuevoNombre.trim()) return;
    const success = await apiAddCategory({ nombreCategoria: nuevoNombre });
    if (success) {
      setNuevoNombre("");
      cargarCategorias();
    } else {
      alert("Error al agregar categoría");
    }
  };

  // Eliminar categoría
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    const success = await apiDeleteCategory(id);
    if (success) cargarCategorias();
    else alert("Error al eliminar categoría");
  };

  // Iniciar edición
  const iniciarEdicion = (categoria) => {
    setEditandoId(categoria.categoriaId);
    setNombreEditado(categoria.nombreCategoria);
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombreEditado("");
  };

  // Guardar cambios
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
    <div style={{ maxWidth: "500px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Categorías</h2>

      {/* Agregar nueva categoría */}
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Nueva categoría"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={handleAgregar} style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}>
          Agregar
        </button>
      </div>

      {/* Lista de categorías */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {categorias.map((c) => (
          <li
            key={c.categoriaId}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.5rem",
              borderBottom: "1px solid #ddd",
            }}
          >
            {/* Mostrar input si está editando, sino mostrar nombre */}
            {editandoId === c.categoriaId ? (
              <input
                type="text"
                value={nombreEditado}
                onChange={(e) => setNombreEditado(e.target.value)}
                style={{ flex: 1, marginRight: "0.5rem", padding: "0.3rem" }}
              />
            ) : (
              <span>{c.nombreCategoria}</span>
            )}

            <div>
              {editandoId === c.categoriaId ? (
                <>
                  <button
                    onClick={() => guardarEdicion(c.categoriaId)}
                    style={{ marginRight: "0.3rem" }}
                  >
                    Guardar
                  </button>
                  <button onClick={cancelarEdicion}>Cancelar</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => iniciarEdicion(c)}
                    style={{ marginRight: "0.3rem" }}
                  >
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(c.categoriaId)}>Eliminar</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categorias;
