import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import '../styles/Checkout.css';
import { formatPrice } from '../utils/priceFormatter';

const CheckoutPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    shippingAddressId: '',
    billingAddressId: '',
    paymentMethod: 'CASH',
    shippingMethod: 'STANDARD'
  });

  useEffect(() => {
    // Check both authentication and localStorage token
    const token = localStorage.getItem('token');
    if (!isAuthenticated && !token) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      setError('User not authenticated');
      return;
    }

    if (!cart?.items?.length) {
      setError('Cart is empty');
      return;
    }

    try {
      const orderPayload = {
        ...formData,
        userId: user.id,
        items: cart.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          productPrice: item.productPrice || item.price
        }))
      };

      const response = await fetch(`http://localhost:8080/api/checkout/user/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      const orderData = await response.json();
      clearCart();
      toast.success('Thanh toán thành công!');
      // Navigate to orders page instead of a specific order
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message || 'Failed to process checkout');
      toast.error('Thanh toán thất bại!');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="cart-items">
            {cart?.items?.map(item => (
              <div key={item.id} className="cart-item">
                <span>{item.productName || item.name}</span>
                <span>{item.quantity} x {formatPrice(item.productPrice || item.price)}</span>
              </div>
            ))}
          </div>
          <div className="total">
            <strong>Total:</strong> {formatPrice(cart?.total || 0)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="CASH">Cash on Delivery</option>
              <option value="CARD">Credit Card</option>
            </select>
          </div>

          <div className="form-group">
            <label>Shipping Method</label>
            <select
              name="shippingMethod"
              value={formData.shippingMethod}
              onChange={handleChange}
            >
              <option value="STANDARD">Standard Shipping</option>
              <option value="EXPRESS">Express Shipping</option>
            </select>
          </div>

          <button type="submit" className="checkout-button">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;