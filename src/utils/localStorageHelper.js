// src/utils/localStorageHelper.js
import { blogPosts as initialBlogPosts } from '../data/blogData'; // Asegúrate de tener este archivo o usa un array vacío []

// Claves
const CART_KEY = 'huertohogar_cart';
const USER_KEY = 'huertohogar_user';
const USERS_LIST_KEY = 'huertohogar_users';
const ORDERS_KEY = 'huertohogar_orders';
const CATEGORIES_KEY = 'huertohogar_categories';
const BLOG_KEY = 'huertohogar_blog'; // NUEVA CLAVE BLOG

// --- Carrito ---
export const getCart = () => {
  try { const cart = localStorage.getItem(CART_KEY); return cart ? JSON.parse(cart) : []; }
  catch (e) { console.error("Error leer carrito", e); return []; }
};
export const saveCart = (cart) => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); dispatchStorageUpdate(); };
export const clearCart = () => { localStorage.removeItem(CART_KEY); dispatchStorageUpdate(); };

// --- Autenticación ---
export const saveLoggedInUser = (user) => { localStorage.setItem(USER_KEY, JSON.stringify(user)); };
export const getLoggedInUser = () => {
  try { const user = localStorage.getItem(USER_KEY); return user ? JSON.parse(user) : null; }
  catch (e) { console.error("Error leer usuario", e); return null; }
};
export const logoutUser = () => { localStorage.removeItem(USER_KEY); dispatchStorageUpdate(); };

// --- Lista de Usuarios (Local fallback) ---
export const getUsersList = () => {
  try { const users = localStorage.getItem(USERS_LIST_KEY); return users ? JSON.parse(users) : []; }
  catch (e) { return []; }
};
export const addUserToList = (newUser) => {
  const users = getUsersList(); 
  if (users.some(u => u.email === newUser.email)) return false;
  users.push(newUser); 
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users)); 
  return true;
};
export const saveUsersList = (users) => { localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users)); };

// --- Órdenes ---
export const getOrders = () => {
  try { const orders = localStorage.getItem(ORDERS_KEY); return orders ? JSON.parse(orders) : []; } 
  catch (e) { return []; }
};
export const saveOrder = (newOrder) => {
  try {
    const orders = getOrders();
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return true;
  } catch (e) { return false; }
};

// --- Categorías (Local fallback) ---
const initialCategories = [
  { key: 'frutas', nombre: 'Frutas' }, { key: 'verduras', nombre: 'Verduras' },
  { key: 'lacteos', nombre: 'Lácteos' }, { key: 'organicos', nombre: 'Orgánicos' },
];
export const getCategories = () => {
  try { const c = localStorage.getItem(CATEGORIES_KEY); return c ? JSON.parse(c) : initialCategories; } 
  catch { return initialCategories; }
};
export const saveCategories = (c) => { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(c)); dispatchStorageUpdate(); };
export const addCategory = (newCat) => {
  if (!newCat.key) return false;
  const cats = getCategories();
  if (cats.some(c => c.key === newCat.key)) return false;
  cats.push(newCat); saveCategories(cats); return true;
};
export const updateCategory = (key, data) => {
  const cats = getCategories(); const idx = cats.findIndex(c => c.key === key);
  if (idx === -1) return false; cats[idx].nombre = data.nombre; saveCategories(cats); return true;
};
export const deleteCategory = (key) => {
  const cats = getCategories(); const newCats = cats.filter(c => c.key !== key);
  saveCategories(newCats); return true;
};
export const getAllCategories = getCategories; // Alias

// --- BLOG (NUEVO) ---
export const getBlogPosts = () => {
  try {
    const storedPosts = localStorage.getItem(BLOG_KEY);
    if (storedPosts) return JSON.parse(storedPosts);
    // Si no hay, usar iniciales y guardar
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

// --- Evento Global ---
export const dispatchStorageUpdate = () => { window.dispatchEvent(new Event('storageUpdate')); };