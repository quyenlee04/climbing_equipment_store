import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import cartService from '../../services/cartService';
import '../../styles/ProductDetail.css';

// Add this import at the top
import RelatedProducts from './RelatedProducts';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {

        const data = await productService.getProductById(id);
        setProduct(data);
        // Set the selected image to the primary image when product loads
        if (data && data.primaryImageUrl) {
          setSelectedImage(data.primaryImageUrl);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && product && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  // Move this inside the render section after the null checks
  // to avoid accessing properties of null

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      await cartService.addToCart(product.id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading product details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  // Calculate the main image URL here after we've confirmed product is not null
  const mainImageUrl = selectedImage
    ? `${process.env.REACT_APP_API_URL}/uploads/${selectedImage}`
    : product.primaryImageUrl
      ? `${process.env.REACT_APP_API_URL}/uploads/${product.primaryImageUrl}`
      : '/placeholder-product.jpg';

  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="product-detail-container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> /
        <Link to="/products">Products</Link> /
        <Link to={`/products?category=${product.categoryId}`}>{product.category}</Link> /
        <span>{product.name}</span>
      </div>

      <div className="product-detail-content">
        <div className="product-images">
          <div className="main-image">
            {/* Fix: Use mainImageUrl instead of product.imageUrl */}
            <img src={mainImageUrl} alt={product.name} />
            {product.discount > 0 && (
              <div className="discount-badge">-{product.discount}%</div>
            )}
          </div>
          <div className="thumbnail-images">
            {product.images && product.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === image.imageUrl ? 'active' : ''}`}
                onClick={() => setSelectedImage(image.imageUrl)}
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${image.imageUrl}`}
                  alt={`${product.name} - view ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <div className="product-meta">
            <p className="product-brand">Brand: <span>{product.brand}</span></p>
            <p className="product-sku">SKU: <span>{product.sku}</span></p>
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < product.rating ? "star filled" : "star"}>★</span>
              ))}
              <span className="rating-count">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="product-price">
            {product.discount > 0 ? (
              <>
                <span className="original-price">${product.price.toFixed(2)}</span>
                <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
                <span className="discount-percentage">Save {product.discount}%</span>
              </>
            ) : (
              <span className="regular-price">${product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="product-availability">
            <span className={product.stockQuantity > 0 ? "in-stock" : "out-of-stock"}>
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
            {product.stockQuantity > 0 && product.stockQuantity < 10 && (
              <span className="low-stock">Only {product.stockQuantity} left!</span>
            )}
          </div>

          <div className="product-description">
            <p>{product.shortDescription}</p>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.stockQuantity}
              />
              <button onClick={incrementQuantity} disabled={quantity >= product.stockQuantity}>+</button>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={addingToCart || product.stockQuantity === 0}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button className="wishlist-btn">Add to Wishlist</button>
          </div>

          {addedToCart && (
            <div className="added-to-cart-message">
              Product added to cart successfully!
            </div>
          )}
        </div>
      </div>

      <div className="product-tabs">
        <div className="tab-headers">
          <button
            className={activeTab === 'description' ? 'active' : ''}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={activeTab === 'specifications' ? 'active' : ''}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button
            className={activeTab === 'reviews' ? 'active' : ''}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.reviewCount})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-tab">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="specifications-tab">
              <table>
                <tbody>
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map(review => (
                  <div className="review" key={review.id}>
                    <div className="review-header">
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "star filled" : "star"}>★</span>
                        ))}
                      </div>
                      <div className="review-author">{review.author}</div>
                      <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                    </div>
                    <div className="review-content">{review.content}</div>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add the RelatedProducts component */}
      <RelatedProducts
        currentProductId={product.id}
        categoryId={product.categoryId}
      />
    </div>
  );
};

export default ProductDetail;