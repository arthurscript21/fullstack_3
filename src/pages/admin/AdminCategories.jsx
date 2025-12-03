import React, { useEffect, useState } from "react";
import { apiGetCategories, apiAddCategory, apiDeleteCategory, apiUpdateCategory } from "../../utils/apiHelperCategoria";
import { getLoggedInUser } from "../../utils/localStorageHelper";

const AdminCategories = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  
  const user = getLoggedInUser();
  const isVendedor = (user?.role || user?.rol || '').toLowerCase() === 'vendedor';

  useEffect(() => { cargarCategorias(); }, []);

  const cargarCategorias = async () => {
    const data = await apiGetCategories();
    setCategorias(data || []);
  };

  const handleAgregar = async () => {
    if (!nuevoNombre.trim()) return;
    const success = await apiAddCategory({ nombreCategoria: nuevoNombre });
    if (success) { setNuevoNombre(""); cargarCategorias(); } else { alert("Error"); }
  };

  const handleEliminar = async(id) => { if(confirm('¿Borrar?')) { await apiDeleteCategory(id); cargarCategorias(); }};
  const guardarEdicion = async(id) => { await apiUpdateCategory(id, {nombreCategoria: nombreEditado}); setEditandoId(null); cargarCategorias(); };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">Categorías</h2>

      {!isVendedor && (
        <div className="card p-4 mb-4 shadow-sm">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Nueva categoría..." value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} />
            <button className="btn btn-success" onClick={handleAgregar}>Agregar</button>
          </div>
        </div>
      )}

      <ul className="list-group shadow-sm">
          {categorias.map((c) => (
            <li key={c.categoriaId} className="list-group-item d-flex justify-content-between align-items-center">
               {editandoId === c.categoriaId ? (
                  <div className="d-flex w-100 gap-2">
                    <input className="form-control" value={nombreEditado} onChange={(e)=>setNombreEditado(e.target.value)} />
                    <button className="btn btn-sm btn-primary" onClick={()=>guardarEdicion(c.categoriaId)}>OK</button>
                    <button className="btn btn-sm btn-secondary" onClick={()=>setEditandoId(null)}>X</button>
                  </div>
               ) : (
                  <>
                    <span>{c.nombreCategoria}</span>
                    {!isVendedor && (
                      <div>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => { setEditandoId(c.categoriaId); setNombreEditado(c.nombreCategoria); }}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(c.categoriaId)}>Eliminar</button>
                      </div>
                    )}
                  </>
               )}
            </li>
          ))}
      </ul>
    </div>
  );
};
export default AdminCategories;