import React from 'react';
import '../../styles/FilterSidebar.css';

const FilterSidebar = ({ 
  brands, 
  categories, 
  selectedBrand, 
  selectedCategory, 
  onBrandChange, 
  onCategoryChange,
  onClearFilters
}) => {
  // Add null checks for brands and categories
  const brandsArray = Array.isArray(brands) ? brands : [];
  const categoriesArray = Array.isArray(categories) ? categories : [];

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters" onClick={onClearFilters}>
          Clear All
        </button>
      </div>
      
      <div className="filter-section">
        <h4>Brands</h4>
        <div className="filter-options">
          <div className="filter-option">
            <input
              type="radio"
              id="brand-all"
              name="brand"
              value=""
              checked={!selectedBrand}
              onChange={() => onBrandChange('')}
            />
            <label htmlFor="brand-all">All Brands</label>
          </div>
          
          {/* Use the safe brandsArray instead of brands directly */}
          {brandsArray.map(brand => (
            <div className="filter-option" key={brand.id}>
              <input
                type="radio"
                id={`brand-${brand.id}`}
                name="brand"
                value={brand.id}
                checked={selectedBrand === brand.id.toString()}
                onChange={() => onBrandChange(brand.id)}
              />
              <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h4>Categories</h4>
        <div className="filter-options">
          <div className="filter-option">
            <input
              type="radio"
              id="category-all"
              name="category"
              value=""
              checked={!selectedCategory}
              onChange={() => onCategoryChange('')}
            />
            <label htmlFor="category-all">All Categories</label>
          </div>
          
          {/* Use the safe categoriesArray instead of categories directly */}
          {categoriesArray.map(category => (
            <div className="filter-option" key={category.id}>
              <input
                type="radio"
                id={`category-${category.id}`}
                name="category"
                value={category.id}
                checked={selectedCategory === category.id.toString()}
                onChange={() => onCategoryChange(category.id)}
              />
              <label htmlFor={`category-${category.id}`}>{category.name}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;