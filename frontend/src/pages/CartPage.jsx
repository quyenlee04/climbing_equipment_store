import React from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../styles/CartPage.css';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../utils/priceFormatter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


const CartPage = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cartItems = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (!user?.id || !itemId) return;
    try {
      const quantity = Math.max(0, parseInt(newQuantity, 10));
      await updateCartItem(itemId, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  const handleCheckout = () => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };
  const handleRemoveItem = async (itemId) => {
    if (!user?.id || !itemId) return;
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  if (!user) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <p>Please login to view your cart</p>
          <Link to="/login" className="continue-shopping">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/products" className="continue-shopping">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img 
                   
                   src={item.productImageUrl ? `http://localhost:8080/uploads/${item.productImageUrl}` : '/placeholder.jpg'} 
                  alt={item.productName || 'Product'} 
                  className="item-image" 
                />
                <div className="item-details">
                  <h3>{item.productName || 'Unknown Product'}</h3>
                  <p className="item-price">{formatPrice(item.productPrice || 0)}</p>
                </div>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >-</button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >+</button>
                </div>
                <div className="item-total">
                  {formatPrice(item.subtotal)}
                </div>
                <button 
                  className="remove-item"
                  onClick={() => handleRemoveItem(item.id)}
                  aria-label={`Remove ${item.productName} from cart`}
                ><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatPrice(totalPrice)} VND</span>
            </div>
            <Link to="/checkout" className="checkout-button" onClick={() => handleCheckout()}>
            
              Thanh Toán
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;