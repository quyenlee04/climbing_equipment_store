import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Orders.css';
import { formatPrice } from '../utils/priceFormatter';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(
          `http://localhost:8080/api/orders/user/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, []);
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'PROCESSING': return 'status-processing';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.orderNumber}</h3>
                  <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div className={`order-status ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </div>
              </div>
              
              <div className="order-items">
                {order.orderItems.map(item => (
                  <div key={item.id} className="order-item">
                    <span className="item-name">{item.productName}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">{formatPrice(item.unitPrice)}</span>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="order-totals">
                  <div>Subtotal: {formatPrice(order.totalAmount - (order.shippingCost || 0))}</div>
                  <div>Shipping: {formatPrice(order.shippingCost || 0)}</div>
                  <div className="total">Total: {formatPrice(order.totalAmount)}</div>
                </div>
                <div className="payment-status">
                  Payment Status: {order.paymentStatus}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;