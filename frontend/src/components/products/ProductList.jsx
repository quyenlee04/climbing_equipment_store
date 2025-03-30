import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import '../../styles/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const selectedBrand = searchParams.get('brand') || '';
  const selectedCategory = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedBrand) params.brandId = selectedBrand;
        if (selectedCategory) params.categoryId = selectedCategory;
        if (searchParams.get('search')) params.search = searchParams.get('search');
        
        const data = await productService.getProducts({ params });
        
        // Sort products based on sortBy parameter
        let sortedProducts = [...data];
        switch (sortBy) {
          case 'price-low-high':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high-low':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          case 'name-a-z':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-z-a':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          default: // newest
            sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        setProducts(sortedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
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
  }, [selectedBrand, selectedCategory, sortBy, searchParams]);
  
  const handleBrandChange = (brandId) => {
    const newParams = new URLSearchParams(searchParams);
    if (brandId) {
      newParams.set('brand', brandId);
    } else {
      newParams.delete('brand');
    }
    setSearchParams(newParams);
  };
  
  const handleCategoryChange = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };
  
  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    setSearchParams(newParams);
  };
  
  const handleClearFilters = () => {
    const newParams = new URLSearchParams();
    if (searchParams.get('search')) {
      newParams.set('search', searchParams.get('search'));
    }
    setSearchParams(newParams);
  };
  
  return (
    <div className="product-list-container">
      <FilterSidebar
        brands={brands}
        categories={categories}
        selectedBrand={selectedBrand}
        selectedCategory={selectedCategory}
        onBrandChange={handleBrandChange}
        onCategoryChange={handleCategoryChange}
        onClearFilters={handleClearFilters}
      />
      
      <div className="product-list-content">
        <div className="product-list-header">
          <h1>Products</h1>
          <div className="sort-container">
            <label htmlFor="sort-by">Sort by:</label>
            <select 
              id="sort-by" 
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">Newest</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
              <option value="name-z-a">Name: Z to A</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : products.length === 0 ? (
          <div className="no-products">No products found. Try adjusting your filters.</div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;