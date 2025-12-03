// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';

// Layouts
import StoreLayout from './layouts/StoreLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute'; // IMPORTANTE

// Páginas Tienda
import Home from './pages/Tienda/home';
import Productos from './pages/Tienda/Productos';
import DetalleProducto from './pages/Tienda/DetalleProducto';
import Carrito from './pages/Tienda/Carrito';
import Contacto from './pages/Tienda/Contacto';
import Nosotros from './pages/Tienda/Nosotros';
import Login from './pages/Tienda/Login';
import Registro from './pages/Tienda/Registro';
import Perfil from './pages/Tienda/Perfil';
import Categorias from './pages/Tienda/Categorias';
import Ofertas from './pages/Tienda/Ofertas';
import Blog from './pages/Tienda/Blog';
import DetalleBlog from './pages/Tienda/DetalleBlog';
import Checkout from './pages/Tienda/Checkout';
import PagoExitoso from './pages/Tienda/PagoExitoso';
import PagoFallido from './pages/Tienda/PagoFallido';

// Páginas Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import CreateProduct from './pages/admin/CreateProduct';
import CreateUser from './pages/admin/CreateUser';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminCategories from './pages/admin/AdminCategories';
import EditUser from './pages/admin/EditUser';
import AdminReports from './pages/admin/AdminReports';
import UserPurchaseHistory from './pages/admin/UserPurchaseHistory';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Tienda (Rutas Públicas) */}
        <Route path="/" element={<StoreLayout />}>
           <Route index element={<Home />} />
           <Route path="productos" element={<Productos />} />
           <Route path="categoria/:categoryName" element={<Productos />} />
           <Route path="productos/:id" element={<DetalleProducto />} />
           <Route path="contacto" element={<Contacto />} />
           <Route path="nosotros" element={<Nosotros />} />
           <Route path="carrito" element={<Carrito />} />
           <Route path="login" element={<Login />} />
           <Route path="registro" element={<Registro />} />
           <Route path="perfil" element={<Perfil />} />
           <Route path="categorias" element={<Categorias />} /> 
           <Route path="ofertas" element={<Ofertas />} />
           <Route path="blog" element={<Blog />} />
           <Route path="blog/:id" element={<DetalleBlog />} />
           <Route path="checkout" element={<Checkout />} />
           <Route path="pago-exitoso" element={<PagoExitoso />} />
           <Route path="pago-fallido" element={<PagoFallido />} />
        </Route>

        {/* Admin (Rutas Protegidas) */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
           <Route index element={<AdminDashboard />} />
           <Route path="ordenes" element={<AdminOrders />} />
           <Route path="ordenes/:id" element={<AdminOrderDetail />} />
           <Route path="productos" element={<AdminProducts />} />
           <Route path="productos/nuevo" element={<CreateProduct />} />
           <Route path="usuarios" element={<AdminUsers />} />
           <Route path="usuarios/nuevo" element={<CreateUser />} />
           <Route path="usuarios/editar/:userId" element={<EditUser />} />
           <Route path="usuarios/historial/:userIdentifier" element={<UserPurchaseHistory />} />
           <Route path="categorias" element={<AdminCategories />} />
           <Route path="reportes" element={<AdminReports />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<div className="text-center py-5"><h1>404</h1><p>Página no encontrada</p></div>} />
      </Routes>
    </AuthProvider>
  );
}
export default App;