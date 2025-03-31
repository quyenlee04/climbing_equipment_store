import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Table, Card, Row, Col, Alert } from 'react-bootstrap';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import { Link } from 'react-router-dom';
import '../../styles/admin/AdminDashboard.css';
import { formatPrice } from '../../utils/priceFormatter';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    products: [],
    totalRevenue: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [orders, products] = await Promise.all([
          orderService.getAllOrders(),
          productService.getProductss()
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const lowStockProducts = products.filter(p => p.stockQuantity < 10);

        setDashboardData({
          orders: orders.slice(0, 5), // Last 5 orders
          products: lowStockProducts.slice(0, 5), // 5 low stock products
          totalRevenue,
          totalOrders: orders.length
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center p-4">Loading dashboard data...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="alert alert-danger m-4">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard p-4">
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-number">{dashboardData.totalOrders}</p>
            <Link to="/admin/orders" className="stat-link">View all orders</Link>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">{formatPrice(dashboardData.totalRevenue)}</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/admin/orders" className="view-all">View All</Link>
            </div>
            <Table hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>{formatPrice(order.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Low Stock Products</h2>
              <Link to="/admin/products" className="view-all">View All</Link>
            </div>
            <Table hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>
                      <span className="low-stock-badge">{product.stockQuantity}</span>
                    </td>
                    <td>{formatPrice(product.price)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;