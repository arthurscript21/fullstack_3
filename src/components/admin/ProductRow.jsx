import React, { useState } from 'react';

function ProductRow({ product, onSave, onDelete, readOnly }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleSave = () => { onSave(editedProduct); setIsEditing(false); };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
  };

  return (
    <tr>
      <td><img src={product.imagen || 'https://via.placeholder.com/50'} alt={product.nombre} className="table-img" /></td>
      <td>
        {isEditing ? <input type="text" name="nombre" className="form-control form-control-sm" value={editedProduct.nombre} onChange={handleChange} /> : product.nombre}
      </td>
      <td>
        {isEditing ? <input type="number" name="precio" className="form-control form-control-sm" value={editedProduct.precio} onChange={handleChange} style={{width:'80px'}} /> : `$${product.precio}`}
      </td>
      <td>
        {isEditing ? <input type="number" name="stock" className="form-control form-control-sm" value={editedProduct.stock} onChange={handleChange} style={{width:'60px'}} /> : product.stock}
      </td>
      <td>
         {isEditing ? <input type="number" name="stockCritico" className="form-control form-control-sm" value={editedProduct.stockCritico} onChange={handleChange} style={{width:'60px'}} /> : product.stockCritico}
      </td>
      <td>
        {isEditing ? (
          <>
            <button className="btn-action btn-view" onClick={handleSave}>Guardar</button>
            <button className="btn-action btn-edit" onClick={() => setIsEditing(false)}>Cancelar</button>
          </>
        ) : (
          <>
            {!readOnly ? (
              <>
                <button className="btn-action btn-edit" onClick={() => setIsEditing(true)}>Editar</button>
                <button className="btn-action btn-delete" onClick={() => { if(confirm('¿Eliminar?')) onDelete(product.id); }}>Eliminar</button>
              </>
            ) : (
              <span className="badge bg-secondary">Solo Lectura</span>
            )}
          </>
        )}
      </td>
    </tr>
  );
}
export default ProductRow;