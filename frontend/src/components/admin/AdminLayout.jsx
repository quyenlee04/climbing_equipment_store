import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/admin/AdminLayout.css';

const AdminLayout = ({ children, title }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src="/logo-small.png" alt="Logo" className="admin-logo" />
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <Link 
                to="/admin" 
                className={`admin-nav-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-tachometer-alt"></i>
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/products" 
                className={`admin-nav-link ${isActive('/admin/products') ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-box"></i>
                Products
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/categories" 
                className={`admin-nav-link ${isActive('/admin/categories') ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-tags"></i>
                Categories
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/brands" 
                className={`admin-nav-link ${isActive('/admin/brands') ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-copyright"></i>
                Brands
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/orders" 
                className={`admin-nav-link ${isActive('/admin/orders') ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-shopping-cart"></i>
                Orders
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users" 
                className={`admin-nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-users"></i>
                Users
              </Link>
            </li>
            <li className="return-to-store-item">
              <Link 
                to="/" 
                className="admin-nav-link return-to-store"
              >
                <i className="fas fa-store"></i>
                Return to Store
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="admin-content">
        <header className="admin-header">
          <div className="header-left">
            <button className="mobile-toggle" onClick={toggleSidebar}>
              <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <h1>{title}</h1>
          </div>
          <div className="admin-user-info">
            <span>Welcome, {user?.firstName }</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;