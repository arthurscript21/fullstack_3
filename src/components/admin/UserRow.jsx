import React from "react";
import { Link } from "react-router-dom";

function UserRow({ user, onDelete, readOnly }) {
  const userIdentifier = encodeURIComponent(user.email);

  return (
    <tr>
      <td>{user.nombre}</td>
      <td>{user.email}</td>
      <td>{user.telefono || "-"}</td>
      <td>{user.direccion || "-"}</td>
      <td>{user.rol || "Cliente"}</td>
      <td>
        <Link to={`/admin/usuarios/historial/${userIdentifier}`} className="btn-action btn-view" title="Ver Historial">
          Historial
        </Link>

        {!readOnly && (
          <>
            <Link to={`/admin/usuarios/editar/${user.id}`} className="btn-action btn-edit">
              Editar
            </Link>
            <button className="btn-action btn-delete" onClick={onDelete}>
              Eliminar
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
export default UserRow;