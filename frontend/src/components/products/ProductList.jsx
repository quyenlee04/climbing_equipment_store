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

  // Get filter values from URL params
  const brandFilter = searchParams.get('brand') || '';
  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
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
        setError('Failed to load filters. Please try again later.');
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Create params object for filtering
        const params = {
          ...(brandFilter && { brand: brandFilter }),
          ...(categoryFilter && { category: categoryFilter }),
          ...(searchQuery && { search: searchQuery }),
          ...(sortBy && { sort: sortBy })
        };

        const data = await productService.getProducts(params);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandFilter, categoryFilter, searchQuery, sortBy]);

  // Add these missing handler functions
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

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Add this function before handleSortChange
  const handleFilterChange = (filterType, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(filterType, value);
    } else {
      newParams.delete(filterType);
    }
    
    setSearchParams(newParams);
  };
  
  const handleSortChange = (sortValue) => {
    handleFilterChange('sort', sortValue);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  if (error && !loading) {
    return <div className="error-message">{error}</div>;
  }

  // Around line 124, you likely have code like this:
  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Products</h1>
        <div className="sort-options">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort" 
            value={sortBy} 
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
      
      <div className="product-list-content">
        <FilterSidebar
          brands={brands}
          categories={categories}
          selectedBrand={brandFilter}
          selectedCategory={categoryFilter}
          onBrandChange={handleBrandChange}
          onCategoryChange={handleCategoryChange}
          onClearFilters={handleClearFilters}
        />
      
        <div className="product-grid-container">
          {loading ? (
            <div className="loading-spinner">Loading products...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : products && products.length > 0 ? ( // Add null check here
            <div className="product-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
              <button onClick={handleClearFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;