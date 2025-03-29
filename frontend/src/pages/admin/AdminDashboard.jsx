import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/admin/AdminDashboard.css';
import dashboardService from '../../services/dashboardService';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
    salesData: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesPeriod, setSalesPeriod] = useState('month');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [basicStats, salesData, topProducts, recentActivity] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getSalesData(salesPeriod),
          dashboardService.getTopProducts(),
          dashboardService.getRecentActivity()
        ]);

        setStats({
          ...basicStats,
          salesData,
          topProducts,
          recentActivity
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
  }, [salesPeriod]);

  const handlePeriodChange = (period) => {
    setSalesPeriod(period);
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="loading">Loading dashboard data...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="error-message">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-dashboard">
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts}</p>
            <Link to="/admin/products" className="stat-link">View all products</Link>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
            <Link to="/admin/orders" className="stat-link">View all orders</Link>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <Link to="/admin/users" className="stat-link">View all users</Link>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/admin/orders" className="view-all">View All</Link>
            </div>
            {stats.recentOrders.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No recent orders</p>
            )}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Low Stock Products</h2>
              <Link to="/admin/products" className="view-all">View All</Link>
            </div>
            {stats.lowStockProducts.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Stock</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockProducts.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>
                        <span className="low-stock-badge">{product.stockQuantity}</span>
                      </td>
                      <td>${product.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No products with low stock</p>
            )}
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Sales Overview</h2>
              <div className="period-selector">
                <button 
                  className={salesPeriod === 'week' ? 'active' : ''}
                  onClick={() => handlePeriodChange('week')}
                >
                  Week
                </button>
                <button 
                  className={salesPeriod === 'month' ? 'active' : ''}
                  onClick={() => handlePeriodChange('month')}
                >
                  Month
                </button>
                <button 
                  className={salesPeriod === 'year' ? 'active' : ''}
                  onClick={() => handlePeriodChange('year')}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="sales-chart">
              {/* In a real application, you would use a charting library like Chart.js or Recharts */}
              <div className="chart-placeholder">
                <p>Sales chart would be displayed here</p>
                <p>Total sales for this {salesPeriod}: ${stats.salesData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Top Selling Products</h2>
            </div>
            {stats.topProducts.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topProducts.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.salesCount} units</td>
                      <td>${product.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No sales data available</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;