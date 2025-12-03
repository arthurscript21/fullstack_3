// src/utils/localStorageHelper.js
import { blogPosts as initialBlogPosts } from '../data/blogData'; 

// --- CLAVES DE ALMACENAMIENTO ---
const CART_KEY = 'huertohogar_cart';
const USER_KEY = 'huertohogar_user';
const USERS_LIST_KEY = 'huertohogar_users';
const ORDERS_KEY = 'huertohogar_orders';
const CATEGORIES_KEY = 'huertohogar_categories';
const BLOG_KEY = 'huertohogar_blog'; 

// ==========================================
// 1. CARRITO DE COMPRAS
// ==========================================
export const getCart = () => {
  try { 
    const cart = localStorage.getItem(CART_KEY); 
    return cart ? JSON.parse(cart) : []; 
  } catch (e) { 
    console.error("Error al leer el carrito:", e); 
    return []; 
  }
};

export const saveCart = (cart) => { 
  localStorage.setItem(CART_KEY, JSON.stringify(cart)); 
  dispatchStorageUpdate(); 
};

export const clearCart = () => { 
  localStorage.removeItem(CART_KEY); 
  dispatchStorageUpdate(); 
};

// ==========================================
// 2. AUTENTICACIÓN (SESIÓN ACTUAL)
// ==========================================
export const saveLoggedInUser = (user) => { 
  localStorage.setItem(USER_KEY, JSON.stringify(user)); 
};

export const getLoggedInUser = () => {
  try { 
    const user = localStorage.getItem(USER_KEY); 
    return user ? JSON.parse(user) : null; 
  } catch (e) { 
    return null; 
  }
};

export const logoutUser = () => { 
  localStorage.removeItem(USER_KEY); 
  dispatchStorageUpdate(); 
};

// ==========================================
// 3. LISTA DE USUARIOS (FALLBACK LOCAL)
// ==========================================
export const getUsersList = () => {
  try { 
    const users = localStorage.getItem(USERS_LIST_KEY); 
    return users ? JSON.parse(users) : []; 
  } catch (e) { 
    return []; 
  }
};

export const addUserToList = (newUser) => {
  const users = getUsersList(); 
  if (users.some(u => u.email === newUser.email)) return false;
  users.push(newUser); 
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users)); 
  return true;
};

export const saveUsersList = (users) => { 
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users)); 
};

// ==========================================
// 4. BLOG (LOCAL)
// ==========================================
export const getBlogPosts = () => {
  try {
    const storedPosts = localStorage.getItem(BLOG_KEY);
    if (storedPosts) return JSON.parse(storedPosts);
    
    // Si no hay posts, inicializar con los datos de prueba
    localStorage.setItem(BLOG_KEY, JSON.stringify(initialBlogPosts || []));
    return initialBlogPosts || [];
  } catch (e) { 
    return initialBlogPosts || []; 
  }
};

export const getBlogPostById = (id) => {
  const posts = getBlogPosts();
  return posts.find(post => post.id === id);
};

// ==========================================
// 5. ÓRDENES (ADMINISTRACIÓN)
// ==========================================
export const getOrders = () => {
  try { 
    const orders = localStorage.getItem(ORDERS_KEY); 
    return orders ? JSON.parse(orders) : []; 
  } catch (e) { 
    return []; 
  }
};

export const saveOrder = (newOrder) => {
  try {
    const orders = getOrders();
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return true;
  } catch (e) { 
    return false; 
  }
};

// ==========================================
// 6. CATEGORÍAS (FALLBACK LOCAL)
// ==========================================
const initialCategories = [
  { categoriaId: 1, nombreCategoria: 'Frutas', key: 'frutas' },
  { categoriaId: 2, nombreCategoria: 'Verduras', key: 'verduras' },
  { categoriaId: 3, nombreCategoria: 'Lácteos', key: 'lacteos' },
  { categoriaId: 4, nombreCategoria: 'Orgánicos', key: 'organicos' },
];

export const getCategories = () => {
  try { 
    const c = localStorage.getItem(CATEGORIES_KEY); 
    return c ? JSON.parse(c) : initialCategories; 
  } catch { 
    return initialCategories; 
  }
};

export const saveCategories = (c) => { 
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(c)); 
  dispatchStorageUpdate(); 
};

export const addCategory = (newCat) => {
  const cats = getCategories();
  // Simular ID autoincremental si no viene
  if (!newCat.categoriaId) newCat.categoriaId = Date.now();
  cats.push(newCat); 
  saveCategories(cats); 
  return true;
};

export const updateCategory = (id, data) => {
  const cats = getCategories(); 
  const idx = cats.findIndex(c => c.categoriaId === id || c.key === id);
  if (idx === -1) return false; 
  
  cats[idx] = { ...cats[idx], ...data };
  saveCategories(cats); 
  return true;
};

export const deleteCategory = (id) => {
  const cats = getCategories(); 
  const newCats = cats.filter(c => c.categoriaId !== id && c.key !== id);
  saveCategories(newCats); 
  return true;
};

// Alias para compatibilidad con código antiguo
export const getAllCategories = getCategories; 

// ==========================================
// EVENTOS Y UTILIDADES
// ==========================================
export const dispatchStorageUpdate = () => { 
  window.dispatchEvent(new Event('storageUpdate')); 
};