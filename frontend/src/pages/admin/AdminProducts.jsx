import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import brandService from '../../services/brandService';
import '../../styles/admin/AdminProducts.css';
import AdminLayout from '../../components/admin/AdminLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  // State for products list
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for form
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    brandId: '',
    sku: '',
    weight: '',
    dimensions: '',
    isActive: true
  });

  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State for categories and brands
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Fetch products, categories, and brands on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchBrands = async () => {
    try {
      const data = await brandService.getBrands();
      setBrands(data);
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setProduct({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      categoryId: '',
      brandId: '',
      sku: '',
      weight: '',
      dimensions: '',
      isActive: true
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditMode(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!product.name?.trim()) {
        throw new Error('Product name is required');
      }

      const formData = new FormData();

      // Add all product fields to FormData
      formData.append('name', product.name.trim());
      formData.append('description', product.description || '');
      formData.append('price', product.price || 0);
      formData.append('stockQuantity', product.stockQuantity || 0);

      // Add optional fields if they exist
      if (product.categoryId) formData.append('categoryId', product.categoryId);
      if (product.brandId) formData.append('brandId', product.brandId);
      if (product.sku) formData.append('sku', product.sku);
      if (product.weight) formData.append('weight', product.weight);
      if (product.dimensions) formData.append('dimensions', product.dimensions);
      if (product.isActive !== undefined) formData.append('isActive', product.isActive);

      // Add image if selected
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      
    if (editMode) {
      await productService.updateProduct(product.id, FormData);
      toast.success('Product updated successfully');
    } else {
      await productService.createProduct(FormData);
      toast.success('Product created successfully');
    }
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error('Product creation failed');
      console.error('Error saving product:', err);
    } finally {
      setSubmitting(false);
    }
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (productToEdit) => {
    setProduct({
      id: productToEdit.id,
      name: productToEdit.name,
      description: productToEdit.description,
      price: productToEdit.price.toString(),
      stockQuantity: productToEdit.stockQuantity.toString(),
      categoryId: productToEdit.categoryId?.toString() || '',
      brandId: productToEdit.brandId?.toString() || '',
      sku: productToEdit.sku || '',
      weight: productToEdit.weight || '',
      dimensions: productToEdit.dimensions || '',
      isActive: productToEdit.isActive
    });

    if (productToEdit.primaryImageUrl) {
      setPreviewUrl(`${process.env.REACT_APP_API_URL}/uploads/${productToEdit.primaryImageUrl}`);
    } else {
      setPreviewUrl(null);
    }

    setSelectedFile(null);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setSuccess('Product deleted successfully!');
        fetchProducts(); // Refresh the product list
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product. Please try again.');
      }
    };
  };

  if (loading) {
    return (
      <AdminLayout title="Product">
        <div className="loading">Loading Products...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Product">
        <div className="error-message">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products">
      <div className="admin-products-container">
        <div className="admin-header">
          <h2>Product Management</h2>
          <Button className="btn-add-product" onClick={() => setIsModalOpen(true)}>
            Add New Product
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Product List Table */}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover responsive className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      {product.primaryImageUrl ? (
                        <img className="product-image"
                          src={`${process.env.REACT_APP_API_URL}/uploads/${product.primaryImageUrl}`}
                          alt={product.name}

                        />
                      ) : (
                        'No image'
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stockQuantity}</td>
                    <td>{categories.find(cat => cat.id === product.categoryId)?.name || 'No category'}</td>
                    <td>
                      <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No products found</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Product Form Modal */}

        {isModalOpen && (
          <div className="product-form-overlay">
            <div className="product-form-modal">
              <button className="modal-close-button" onClick={() => setIsModalOpen(false)}>×</button>
              <h3 className="form-title">{editMode ? 'Edit Product' : 'Add New Product'}</h3>

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="required">Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>SKU</Form.Label>
                      <Form.Control
                        type="text"
                        name="sku"
                        value={product.sku}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock Quantity <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="stockQuantity"
                        value={product.stockQuantity}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="categoryId"
                        value={product.categoryId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Brand</Form.Label>
                      <Form.Select
                        name="brandId"
                        value={product.brandId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Brand</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Weight</Form.Label>
                      <Form.Control
                        type="text"
                        name="weight"
                        value={product.weight}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dimensions</Form.Label>
                      <Form.Control
                        type="text"
                        name="dimensions"
                        value={product.dimensions}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Active"
                    name="isActive"
                    checked={product.isActive}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Product Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mt-2"
                      style={{ maxWidth: '200px' }}
                    />
                  )}
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="submit-button"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        {editMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editMode ? 'Update Product' : 'Create Product'
                    )}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};


export default AdminProducts;


