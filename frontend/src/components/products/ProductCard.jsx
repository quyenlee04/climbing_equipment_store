import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  // Function to render the product image
  const imageUrl = product.primaryImageUrl
    ? `${process.env.REACT_APP_API_URL}/uploads/${product.primaryImageUrl}`
    : '/placeholder-product.jpg';

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-image-container">
          <img
            src={imageUrl}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.jpg';
            }}
          />
        </div>
      </Link>
      <div className="product-info">
        <h3 className="product-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-brand">{product.brand}</p>
        <div className="product-price">
          {product.discount > 0 ? (
            <>
              <span className="original-price">${product.price.toFixed(2)}</span>
              <span className="discounted-price">
                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="regular-price">${product.price.toFixed(2)}</span>
          )}
        </div>
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < product.rating ? "star filled" : "star"}>★</span>
          ))}
          <span className="rating-count">({product.reviewCount})</span>
        </div>
      </div>
      <div className="product-actions">
        <button className="add-to-cart-btn">Add to Cart</button>
        <button className="wishlist-btn">♡</button>
      </div>
    </div>
  );
};

export default ProductCard;