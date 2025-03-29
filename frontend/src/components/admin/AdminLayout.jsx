import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/admin/AdminLayout.css';

const AdminLayout = ({ children, title }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="/admin" className="admin-nav-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="admin-nav-link">
                Products
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="admin-nav-link">
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="admin-nav-link">
                Orders
              </Link>
            </li>
            // Inside the admin-nav ul, add this list item:
            <li>
              <Link to="/admin/brands" className="admin-nav-link">
                Brands
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="admin-nav-link">
                Categories
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="admin-content">
        <header className="admin-header">
          <h1>{title}</h1>
          <div className="admin-user-info">
            <span>Welcome, {currentUser?.firstName || 'Admin'}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;