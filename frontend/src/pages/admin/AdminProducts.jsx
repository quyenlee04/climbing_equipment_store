import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import brandService from '../../services/brandService';
import '../../styles/admin/AdminProducts.css';

const AdminProducts = () => {
  // State for products list
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
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
      if (!product.name || !product.description || !product.price || !product.stockQuantity) {
        throw new Error('Please fill in all required fields');
      }
      
      // Create FormData object
      const formData = new FormData();
      
      // Add all product fields to FormData
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('stockQuantity', product.stockQuantity);
      
      if (product.categoryId) formData.append('categoryId', product.categoryId);
      if (product.brandId) formData.append('brandId', product.brandId);
      if (product.sku) formData.append('sku', product.sku);
      if (product.weight) formData.append('weight', product.weight);
      if (product.dimensions) formData.append('dimensions', product.dimensions);
      formData.append('isActive', product.isActive);
      
      // Add image if selected
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      
      console.log('Submitting product with FormData');
      
      let savedProduct;
      if (editMode && product.id) {
        savedProduct = await productService.updateProduct(product.id, formData);
      } else {
        savedProduct = await productService.createProduct(formData);
      }
      
      resetForm();
      setSuccess(`Product ${editMode ? 'updated' : 'created'} successfully!`);
      fetchProducts(); // Refresh the product list
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
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
    
    // Set preview URL if product has an image
    if (productToEdit.primaryImageUrl) {
      setPreviewUrl(`${process.env.REACT_APP_API_URL}/uploads/${productToEdit.primaryImageUrl}`);
    } else {
      setPreviewUrl(null);
    }
    
    setSelectedFile(null); // Clear selected file when editing
    setEditMode(true);
    window.scrollTo(0, 0); // Scroll to form
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
    }
  };

  return (
    <Container className="admin-products-container">
      <h1 className="my-4">{editMode ? 'Edit Product' : 'Add New Product'}</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleSubmit} className="product-form mb-5">
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={product.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
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
                  <Form.Label>Stock Quantity *</Form.Label>
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
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={product.sku}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
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
              <Col md={4}>
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
          </Col>
          
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="image-preview-container mt-3">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Product preview"
                    className="img-thumbnail"
                  />
                ) : (
                  <div className="no-image-placeholder">No image selected</div>
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
        
        <div className="d-flex mt-4">
          <Button 
            variant="primary" 
            type="submit" 
            className="me-2"
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
          <Button 
            variant="secondary" 
            onClick={resetForm}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </Form>
      
      <h2 className="my-4">Product List</h2>
      
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
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
                      <img
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
                  <td>{product.category || 'N/A'}</td>
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
    </Container>
  );
};

export default AdminProducts;