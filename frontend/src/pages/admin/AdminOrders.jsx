import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Table, Container, Badge, Form, Spinner } from 'react-bootstrap';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/admin/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data || []); // Ensure we always have an array
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      
      setSelectedStatus({ ...selectedStatus, [orderId]: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      'PENDING': 'warning',
      'PROCESSING': 'info',
      'SHIPPED': 'primary',
      'DELIVERED': 'success',
      'CANCELLED': 'danger',
      'RETURNED': 'secondary',
      'REFUNDED': 'dark'
    };
    return variants[status] || 'light';
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Container fluid className="p-4">
        <h2 className="mb-4">Order Management</h2>
        
        <div className="bg-white rounded shadow-sm">
          <Table hover responsive>
            <thead className="bg-light">
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
                  <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{order.userId}</td>
                  <td>${order.totalAmount || 0}</td>
                  <td>
                    <Badge bg={getStatusVariant(order.orderStatus)}>
                      {order.orderStatus || 'N/A'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg="secondary">
                      {order.paymentStatus || 'N/A'}
                    </Badge>
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={selectedStatus[order.id] || ''}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="w-auto"
                    >
                      <option value="">Update Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="RETURNED">Returned</option>
                      <option value="REFUNDED">Refunded</option>
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </AdminLayout>
  );
};

export default AdminOrders;