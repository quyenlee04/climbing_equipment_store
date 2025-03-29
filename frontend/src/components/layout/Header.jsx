import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';
import logoImg from '../../assets/images/place_your_logo_here_doub.png';

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-content">
        <div className="logo-container">
          <Link to="/">
            <img src={logoImg} alt="Your Logo" className="logo" />
          </Link>
        </div>
        
        <nav className="main-nav">
          <Link to="/" className="nav-item">HOME</Link>
          <Link to="/products" className="nav-item">PRODUCT</Link>
          <Link to="/promo" className="nav-item">PROMO</Link>
          <Link to="/about" className="nav-item">ABOUT</Link>
          <Link to="/contact" className="nav-item">CONTACT</Link>
        </nav>
        
        <div className="hero-content">
          <h1 className="hero-title">LET'S GO HIKE</h1>
          <p className="hero-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.
          </p>
          <button className="order-button">ORDER NOW</button>
        </div>
      </div>
    </div>
  );
};

export default Header;