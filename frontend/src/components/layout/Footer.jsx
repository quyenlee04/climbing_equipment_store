import React from 'react';
import '../../styles/Footer.css';
import facebookIcon from '../../assets/images/facebook.png';
import twitterIcon from '../../assets/images/twitter.png';
import instagramIcon from '../../assets/images/instagram.png';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-title">Title Here</h3>
          <p className="footer-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at dignissim nunc,
            id maximus ex. Etiam nec dignissim elit, at dignissim enim.
          </p>
          <div className="social-icons">
            <a href="https://www.instagram.com/quyenlei/" className="social-icon"><img src={instagramIcon} alt="Instagram" /></a>
            <a href="https://www.facebook.com/quyenj09" className="social-icon"><img src={facebookIcon} alt="Facebook" /></a>
            <a href="#" className="social-icon"><img src={twitterIcon} alt="Twitter" /></a>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">About</h3>
          <ul className="footer-links">
            <li><a href="#">History</a></li>
            <li><a href="#">Our Team</a></li>
            <li><a href="#">Brand Guidelines</a></li>
            <li><a href="#">Terms & Condition</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Services</h3>
          <ul className="footer-links">
            <li><a href="#">How to Order</a></li>
            <li><a href="#">Our Products</a></li>
            <li><a href="#">Order Status</a></li>
            <li><a href="#">Promo</a></li>
            <li><a href="#">Payment Method</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Other</h3>
          <ul className="footer-links">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Help</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;