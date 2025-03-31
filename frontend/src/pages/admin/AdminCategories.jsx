import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import productService from '../../services/productService';
import '../../styles/admin/AdminCategories.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value
    });
  };

  const handleAddCategory = () => {
    setIsEditing(false);
    setCurrentCategory({
      name: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setIsEditing(true);
    setCurrentCategory({
      ...category
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let updatedCategory;
      
      if (isEditing) {
        updatedCategory = await productService.updateCategory(currentCategory.id, currentCategory);
        setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      } else {
        updatedCategory = await productService.createCategory(currentCategory);
        setCategories([...categories, updatedCategory]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Failed to save category. Please try again.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      try {
        await productService.deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Categories">
        <div className="loading">Loading categories...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Categories">
        <div className="error-message">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categories">
      <div className="admin-categories">
        <div className="admin-actions">
          <button className="btn-add-product" onClick={handleAddCategory}>
            Add New Category
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.productCount || 0}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditCategory(category)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteCategory(category.id)}
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
            <div className="category-modal">
              <h2>{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Category Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentCategory.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentCategory.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button">
                    {isEditing ? 'Update Category' : 'Add Category'}
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

export default AdminCategories;