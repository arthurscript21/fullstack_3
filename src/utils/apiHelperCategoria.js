const CATEGORY_API_URL = "http://localhost:8085/api/categorias";

// Obtener todas las categorías
export async function apiGetCategories() {
  try {
    const res = await fetch(CATEGORY_API_URL);
    if (!res.ok) throw new Error("Error al obtener categorías");
    const data = await res.json();

    // Mapear del backend al frontend
    return data.map(c => ({
      categoriaId: c.categoriaId,
      nombreCategoria: c.nombreCategoria
    }));
  } catch (error) {
    console.error("apiGetCategories:", error);
    return [];
  }
}

// Agregar nueva categoría
export async function apiAddCategory(category) {
  try {
    const res = await fetch(CATEGORY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreCategoria: category.nombreCategoria }),
    });
    return res.ok;
  } catch (error) {
    console.error("apiAddCategory:", error);
    return false;
  }
}

// Actualizar categoría
export async function apiUpdateCategory(id, updatedCategory) {
  try {
    const res = await fetch(`${CATEGORY_API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreCategoria: updatedCategory.nombreCategoria }),
    });
    return res.ok;
  } catch (error) {
    console.error("apiUpdateCategory:", error);
    return false;
  }
}

// Eliminar categoría
export async function apiDeleteCategory(id) {
  try {
    const res = await fetch(`${CATEGORY_API_URL}/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (error) {
    console.error("apiDeleteCategory:", error);
    return false;
  }
}
