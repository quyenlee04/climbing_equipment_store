import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import orderService from '../../services/orderService';
import '../../styles/admin/AdminOrders.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const orderDetails = await orderService.getOrderById(orderId);
      setSelectedOrder(orderDetails);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching order details:', err);
      alert('Failed to load order details. Please try again.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));
      
      if (selectedOrder && selectedOrder.id === updatedOrder.id) {
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  const applyFilters = () => {
    let filtered = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === statusFilter
      );
    }
    
    // Apply date range filter
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      filtered = filtered.filter(order => 
        new Date(order.orderDate) >= fromDate
      );
    }
    
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of the day
      filtered = filtered.filter(order => 
        new Date(order.orderDate) <= toDate
      );
    }
    
    return filtered;
  };

  const filteredOrders = applyFilters();

  if (loading) {
    return (
      <AdminLayout title="Orders">
        <div className="loading">Loading orders...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Orders">
        <div className="error-message">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Orders">
      <div className="admin-orders">
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select 
              id="status-filter" 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="date-from">From:</label>
            <input 
              type="date" 
              id="date-from"
              name="from"
              value={dateRange.from}
              onChange={handleDateRangeChange}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="date-to">To:</label>
            <input 
              type="date" 
              id="date-to"
              name="to"
              value={dateRange.to}
              onChange={handleDateRangeChange}
            />
          </div>
          
          <button 
            className="reset-button"
            onClick={() => {
              setStatusFilter('all');
              setDateRange({ from: '', to: '' });
            }}
          >
            Reset Filters
          </button>
        </div>

        <div className="order-summary">
          <div className="summary-card">
            <h3>Total Orders</h3>
            <p>{filteredOrders.length}</p>
          </div>
          
          <div className="summary-card">
            <h3>Pending</h3>
            <p>{orders.filter(order => order.status.toLowerCase() === 'pending').length}</p>
          </div>
          
          <div className="summary-card">
            <h3>Processing</h3>
            <p>{orders.filter(order => order.status.toLowerCase() === 'processing').length}</p>
          </div>
          
          <div className="summary-card">
            <h3>Shipped</h3>
            <p>{orders.filter(order => order.status.toLowerCase() === 'shipped').length}</p>
          </div>
          
          <div className="summary-card">
            <h3>Delivered</h3>
            <p>{orders.filter(order => order.status.toLowerCase() === 'delivered').length}</p>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
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
                  <td className="actions-cell">
                    <button 
                      className="view-button"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-orders">No orders found matching your filters</td>
              </tr>
            )}
          </tbody>
        </table>

        {isModalOpen && selectedOrder && (
          <div className="modal-overlay">
            <div className="order-modal">
              <h2>Order #{selectedOrder.id}</h2>
              
              <div className="order-details">
                <div className="order-info">
                  <h3>Order Information</h3>
                  <p><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                  <p><strong>Status:</strong> 
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </p>
                  <p><strong>Total:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                </div>
                
                <div className="customer-info">
                  <h3>Customer Information</h3>
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customerPhone || 'N/A'}</p>
                </div>
                
                <div className="shipping-info">
                  <h3>Shipping Address</h3>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
              
              <div className="order-items">
                <h3>Order Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="product-info">
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name} 
                              className="product-thumbnail" 
                            />
                            <div>
                              <p className="product-name">{item.product.name}</p>
                              <p className="product-sku">SKU: {item.product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-right"><strong>Subtotal</strong></td>
                      <td>${selectedOrder.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-right"><strong>Shipping</strong></td>
                      <td>${selectedOrder.shippingCost.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-right"><strong>Tax</strong></td>
                      <td>${selectedOrder.taxAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="total-row">
                      <td colSpan="3" className="text-right"><strong>Total</strong></td>
                      <td>${selectedOrder.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="order-actions">
                <button 
                  className="print-button"
                  onClick={() => window.print()}
                >
                  Print Order
                </button>
                
                <button 
                  className="close-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;