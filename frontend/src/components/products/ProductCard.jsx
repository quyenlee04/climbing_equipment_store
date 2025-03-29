import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
        {product.discount > 0 && (
          <div className="discount-badge">-{product.discount}%</div>
        )}
      </div>
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