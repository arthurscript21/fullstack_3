// src/utils/apiHelper.js
// Archivo para centralizar todas las llamadas HTTP a la API de Spring Boot

const API_BASE_URL = 'http://localhost:8085';

// --- Funciones de la API para USUARIOS ---

// 1. Obtener todos los usuarios
export const fetchAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudo obtener la lista de usuarios.`);
    }
    const users = await response.json();
    return users; // Devuelve la lista de objetos Usuarios
  } catch (error) {
    console.error("Error en fetchAllUsers:", error);
    return []; // Devuelve un array vacío en caso de fallo
  }
};

// 2. Crear un nuevo usuario (Registro)
export const createNewUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/addUsuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (response.status === 409) {
      const errorMessage = await response.text();
      return { success: false, message: errorMessage };
    }
    if (!response.ok) {
      throw new Error(`Error ${response.status}: Falló el registro.`);
    }

    const newUser = await response.json();
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error en createNewUser:", error);
    return { success: false, message: error.message };
  }
};

// 3. Actualizar un usuario existente
export const updateExistingUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/updateUsuario`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: Falló la actualización.`);
    }

    const updatedUser = await response.json();
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error en updateExistingUser:", error);
    return { success: false, message: error.message };
  }
};

// 4. Eliminar un usuario por ID
export const deleteUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/deleteUsuario/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      // El backend devuelve un String, por lo que 200/204 es la respuesta esperada
      throw new Error(`Error ${response.status}: No se pudo eliminar el usuario.`);
    }

    // El backend devuelve un string "Usueario eliminado[id]", lo manejamos como texto
    const message = await response.text();
    return { success: true, message: message };
  } catch (error) {
    console.error("Error en deleteUserById:", error);
    return { success: false, message: error.message };
  }
};

// 5. Obtener usuario por Email (Simulación de login en el frontend)
// NOTA: Esto solo busca en el frontend la lista, no es un endpoint del backend.
// Debería ser reemplazado por un endpoint de LOGIN en el backend.
export const fetchUserByEmail = async (email) => {
  const users = await fetchAllUsers();
  // Buscamos al usuario en la lista devuelta por la API
  return users.find(u => u.correo === email); 
};
