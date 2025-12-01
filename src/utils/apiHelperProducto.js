// src/utils/apiHelperProducto.js - CORREGIDO
const API_URL = "http://localhost:8085/api";

export const apiGetProductos = async () => {
  try {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("apiGetProductos:", error);
    throw error;
  }
};

export const apiGetProductoById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/productoById/${id}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("apiGetProductoById:", error);
    throw error;
  }
};

export const apiAddProducto = async (producto) => {
  try {
    const response = await fetch(`${API_URL}/addProduct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${responseText}`);
    }
    
    // Si la respuesta es texto vacío pero el status es OK
    if (!responseText) {
      return { success: true };
    }
    
    return JSON.parse(responseText);
    
  } catch (error) {
    console.error("apiAddProducto:", error);
    throw error;
  }
};

export const apiUpdateProducto = async (producto) => {
  try {
    console.log("Enviando actualización:", producto);
    
    const response = await fetch(`${API_URL}/updateProduct`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    
    const responseText = await response.text();
    console.log("Respuesta del servidor:", responseText);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${responseText}`);
    }
    
    // Si la respuesta es texto vacío pero el status es OK
    if (!responseText) {
      return { success: true };
    }
    
    return JSON.parse(responseText);
    
  } catch (error) {
    console.error("apiUpdateProducto:", error);
    throw error;
  }
};

export const apiDeleteProducto = async (id) => {
  try {
    const response = await fetch(`${API_URL}/deleteProduct/${id}`, {
      method: "DELETE",
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${responseText}`);
    }
    
    return responseText || "Producto eliminado exitosamente";
    
  } catch (error) {
    console.error("apiDeleteProducto:", error);
    throw error;
  }
};