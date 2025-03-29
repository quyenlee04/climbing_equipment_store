import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { AuthProvider } from './contexts/AuthContext';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminLogin from './pages/admin/AdminLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminProducts />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminOrders />
            </ProtectedRoute>
          } />
          
          // Inside the Routes component, add this route:
          <Route path="/admin/categories" element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminCategories />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/brands" element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminBrands />
            </ProtectedRoute>
          } />
          
       
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;