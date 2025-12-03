// src/utils/localStorageHelper.js
import { blogPosts as initialBlogPosts } from '../data/blogData';

const CART_KEY = 'huertohogar_cart';
const USER_KEY = 'huertohogar_user';
const BLOG_KEY = 'huertohogar_blog'; 

// --- Carrito ---
export const getCart = () => {
  try { const cart = localStorage.getItem(CART_KEY); return cart ? JSON.parse(cart) : []; }
  catch (e) { return []; }
};
export const saveCart = (cart) => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); dispatchStorageUpdate(); };
export const clearCart = () => { localStorage.removeItem(CART_KEY); dispatchStorageUpdate(); };

// --- Autenticación (Sesión) ---
export const saveLoggedInUser = (user) => { localStorage.setItem(USER_KEY, JSON.stringify(user)); };
export const getLoggedInUser = () => {
  try { const user = localStorage.getItem(USER_KEY); return user ? JSON.parse(user) : null; }
  catch (e) { return null; }
};
export const logoutUser = () => { localStorage.removeItem(USER_KEY); dispatchStorageUpdate(); };

// --- Usuarios (Solo para Login Híbrido/Local de emergencia) ---
const USERS_LIST_KEY = 'huertohogar_users';
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

// --- Blog (Local) ---
export const getBlogPosts = () => {
  try {
    const storedPosts = localStorage.getItem(BLOG_KEY);
    if (storedPosts) return JSON.parse(storedPosts);
    // Si no hay posts guardados, cargamos los iniciales
    localStorage.setItem(BLOG_KEY, JSON.stringify(initialBlogPosts || []));
    return initialBlogPosts || [];
  } catch (e) { return initialBlogPosts || []; }
};

export const getBlogPostById = (id) => {
  const posts = getBlogPosts();
  return posts.find(post => post.id === id);
};

export const dispatchStorageUpdate = () => { window.dispatchEvent(new Event('storageUpdate')); };