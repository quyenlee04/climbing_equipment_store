import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import orderService from '../../services/orderService';
import { formatPrice } from '../../utils/priceFormatter';
import { Dropdown } from 'react-bootstrap';
import '../../styles/admin/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchOrders(); // Refresh orders after update
      setError(null);
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updatePaymentStatus(orderId, newStatus);
      fetchOrders(); // Refresh orders after update
      setError(null);
    } catch (err) {
      setError('Failed to update payment status');
      console.error('Error updating payment status:', err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PROCESSING': return 'badge-processing';
      case 'DELIVERED': return 'badge-delivered';
      case 'CANCELLED': return 'badge-cancelled';
      default: return 'badge-pending';
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED': return 'badge-completed';
      case 'FAILED': return 'badge-failed';
      case 'REFUNDED': return 'badge-refunded';
      default: return 'badge-pending';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <AdminLayout>
      <div className="order-management">
        <h1>Order Management</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Customer ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{order.userId}</td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" size="sm">
                        Update Status
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Header>Order Status</Dropdown.Header>
                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'PENDING')}>Pending</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'PROCESSING')}>Processing</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'DELIVERED')}>Delivered</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'CANCELLED')}>Cancelled</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Header>Payment Status</Dropdown.Header>
                        <Dropdown.Item onClick={() => handlePaymentStatusChange(order.id, 'PENDING')}>Pending</Dropdown.Item>
                        <Dropdown.Item onClick={() => handlePaymentStatusChange(order.id, 'COMPLETED')}>Completed</Dropdown.Item>
                        <Dropdown.Item onClick={() => handlePaymentStatusChange(order.id, 'FAILED')}>Failed</Dropdown.Item>
                        <Dropdown.Item onClick={() => handlePaymentStatusChange(order.id, 'REFUNDED')}>Refunded</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;