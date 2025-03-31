import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ProductCard.css';
import { formatPrice } from '../../utils/priceFormatter';


const ProductCard = ({ product }) => {
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
            className="product-card-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.jpg';
            }}
          />
        </div>
        <div className="product-info-card">
          <h3 className="product-name-card">{product.name}</h3>
          <div className="product-price-card">
            {product.discount > 0 ? (
              <>
                <span className="discounted-price">{(product.price * (1 - product.discount / 100)).toFixed()} VND</span>
                <span className="original-price">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="regular-price">{formatPrice(product.price)}</span>
            )}
          </div>
          <div className="product-rating-card">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < product.rating ? "star filled" : "star"}>★</span>
          ))}
          <span className="rating-count">({product.reviewCount})</span>
        </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;