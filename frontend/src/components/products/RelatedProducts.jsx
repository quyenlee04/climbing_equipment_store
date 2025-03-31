import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import '../../styles/RelatedProducts.css';
import { formatPrice } from '../../utils/priceFormatter';


const RelatedProducts = ({ currentProductId, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      try {
        const params = {
          category: categoryId,
          limit: 4
        };
        
        const data = await productService.getProducts(params);
        // Filter out the current product
        const filteredProducts = data.filter(product => product.id !== currentProductId);
        setProducts(filteredProducts.slice(0, 4)); // Ensure we only take up to 4 products
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, categoryId]);

  if (loading) {
    return <div className="loading">Loading related products...</div>;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <div className="related-products-grid">
        {products.map(product => (
          <div className="related-product-card" key={product.id}>
            <Link to={`/products/${product.id}`}>
              <div className="related-product-image">
                <img 
                  src={product.primaryImageUrl ? 
                    `${process.env.REACT_APP_API_URL}/uploads/${product.primaryImageUrl}` : 
                    '/placeholder-image.jpg'} 
                  alt={product.name} 
                />
                {product.discount > 0 && (
                  <div className="discount-badge">-{product.discount}%</div>
                )}
              </div>
              <div className="related-product-info">
                <h3>{product.name}</h3>
                <div className="related-product-price">
                  {product.discount > 0 ? (
                    <>
                      <span className="original-price">{formatPrice(product.price)}</span>
                      <span className="discounted-price">
                        {(product.price * (1 - product.discount / 100)).toFixed() } VND
                      </span>
                    </>
                  ) : (
                    <span className="regular-price">{formatPrice(product.price)}</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;