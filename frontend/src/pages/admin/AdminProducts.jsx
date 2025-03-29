import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import productService from '../../services/productService';
import '../../styles/admin/AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    brandId: '',
    imageUrl: '',
    discount: '0'
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    const fetchFilters = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          productService.getBrands(),
          productService.getCategories()
        ]);
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };

    fetchProducts();
    fetchFilters();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value
    });
  };

  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProduct({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      categoryId: '',
      brandId: '',
      imageUrl: '',
      discount: '0'
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setCurrentProduct({
      ...product,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      discount: product.discount.toString(),
      categoryId: product.categoryId.toString(),
      brandId: product.brandId.toString()
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...currentProduct,
        price: parseFloat(currentProduct.price),
        stockQuantity: parseInt(currentProduct.stockQuantity),
        discount: parseInt(currentProduct.discount),
        categoryId: parseInt(currentProduct.categoryId),
        brandId: parseInt(currentProduct.brandId)
      };

      let updatedProduct;
      
      if (isEditing) {
        updatedProduct = await productService.updateProduct(currentProduct.id, productData);
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      } else {
        updatedProduct = await productService.createProduct(productData);
        setProducts([...products, updatedProduct]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Products">
        <div className="loading">Loading products...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Products">
        <div className="error-message">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products">
      <div className="admin-products">
        <div className="admin-actions">
          <button className="add-button" onClick={handleAddProduct}>
            Add New Product
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="product-thumbnail" 
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stockQuantity}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteProduct(product.id)}
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
            <div className="product-modal">
              <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentProduct.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={currentProduct.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="stockQuantity">Stock Quantity</label>
                    <input
                      type="number"
                      id="stockQuantity"
                      name="stockQuantity"
                      min="0"
                      value={currentProduct.stockQuantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="discount">Discount (%)</label>
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      min="0"
                      max="100"
                      value={currentProduct.discount}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="categoryId">Category</label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={currentProduct.categoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="brandId">Brand</label>
                    <select
                      id="brandId"
                      name="brandId"
                      value={currentProduct.brandId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={currentProduct.imageUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button">
                    {isEditing ? 'Update Product' : 'Add Product'}
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

export default AdminProducts;