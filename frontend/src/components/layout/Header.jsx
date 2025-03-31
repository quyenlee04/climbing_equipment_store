import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Header.css';
import { useAuth } from '../../contexts/AuthContext';
import logoImg from '../../assets/images/place_your_logo_here_doub.png';
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const isAdmin = user && user.roles &&
    (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ADMIN'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="logo-container">
          <Link to="/">
            <img src={logoImg} alt="ClimbGear" className="logo" />
          </Link>
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/">Home</Link>
            </li>
            <li className={location.pathname.includes('/products') ? 'active' : ''}>
              <Link to="/products">Products</Link>
            </li>
            <li className={location.pathname === '/about' ? 'active' : ''}>
              <Link to="/about">About</Link>
            </li>
            <li className={location.pathname === '/contact' ? 'active' : ''}>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        
        <div className="header-actions">
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            <span className="cart-count">0</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <div className="user-menu" ref={dropdownRef}>
                <div className="user-profile" onClick={toggleDropdown}>
                  <FaUserCircle />
                  <span className="username">{user?.firstName}</span>
                </div>
                
                <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
                  <Link to="/profile" className="dropdown-item">My Profile</Link>
                  <Link to="/orders" className="dropdown-item">My Orders</Link>
                  {user?.roles?.includes('ROLE_ADMIN') && (
                    <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
                  )}
                  <button onClick={logout} className="logout-btn">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/register" className="register-link">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;