import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import productService from '../../services/productService';
import '../../styles/admin/AdminBrands.css';

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState({
    name: '',
    description: '',
    logoUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await productService.getBrands();
      setBrands(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBrand({
      ...currentBrand,
      [name]: value
    });
  };

  const handleAddBrand = () => {
    setIsEditing(false);
    setCurrentBrand({
      name: '',
      description: '',
      logoUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand) => {
    setIsEditing(true);
    setCurrentBrand({
      ...brand
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let updatedBrand;
      
      if (isEditing) {
        updatedBrand = await productService.updateBrand(currentBrand.id, currentBrand);
        setBrands(brands.map(b => b.id === updatedBrand.id ? updatedBrand : b));
      } else {
        updatedBrand = await productService.createBrand(currentBrand);
        setBrands([...brands, updatedBrand]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving brand:', err);
      alert('Failed to save brand. Please try again.');
    }
  };

  const handleDeleteBrand = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand? This will affect all products of this brand.')) {
      try {
        await productService.deleteBrand(id);
        setBrands(brands.filter(b => b.id !== id));
      } catch (err) {
        console.error('Error deleting brand:', err);
        alert('Failed to delete brand. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Brands">
        <div className="loading">Loading brands...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Brands">
        <div className="error-message">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Brands">
      <div className="admin-brands">
        <div className="admin-actions">
          <button className="add-button" onClick={handleAddBrand}>
            Add New Brand
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Description</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(brand => (
              <tr key={brand.id}>
                <td>
                  {brand.logoUrl && (
                    <img 
                      src={brand.logoUrl} 
                      alt={brand.name} 
                      className="brand-logo" 
                    />
                  )}
                </td>
                <td>{brand.name}</td>
                <td>{brand.description}</td>
                <td>{brand.productCount || 0}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditBrand(brand)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteBrand(brand.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="brand-modal">
              <h2>{isEditing ? 'Edit Brand' : 'Add New Brand'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Brand Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentBrand.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentBrand.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="logoUrl">Logo URL</label>
                  <input
                    type="text"
                    id="logoUrl"
                    name="logoUrl"
                    value={currentBrand.logoUrl}
                    onChange={handleInputChange}
                  />
                </div>

                {currentBrand.logoUrl && (
                  <div className="logo-preview">
                    <img src={currentBrand.logoUrl} alt="Brand Logo Preview" />
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button">
                    {isEditing ? 'Update Brand' : 'Add Brand'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBrands;