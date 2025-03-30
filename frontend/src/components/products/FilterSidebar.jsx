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
  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters" onClick={onClearFilters}>
          Clear All
        </button>
      </div>
      
      {brands && brands.length > 0 && (
        <div className="filter-section">
          <h4>Brands</h4>
          <div className="filter-options">
            <div className="filter-option">
              <input
                type="radio"
                id="all-brands"
                name="brand"
                value=""
                checked={!selectedBrand}
                onChange={() => onBrandChange('')}
              />
              <label htmlFor="all-brands">All Brands</label>
            </div>
            
            {brands.map(brand => (
              <div className="filter-option" key={brand.id}>
                <input
                  type="radio"
                  id={`brand-${brand.id}`}
                  name="brand"
                  value={brand.id}
                  checked={selectedBrand === brand.id.toString()}
                  onChange={() => onBrandChange(brand.id.toString())}
                />
                <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {categories && categories.length > 0 && (
        <div className="filter-section">
          <h4>Categories</h4>
          <div className="filter-options">
            <div className="filter-option">
              <input
                type="radio"
                id="all-categories"
                name="category"
                value=""
                checked={!selectedCategory}
                onChange={() => onCategoryChange('')}
              />
              <label htmlFor="all-categories">All Categories</label>
            </div>
            
            {categories.map(category => (
              <div className="filter-option" key={category.id}>
                <input
                  type="radio"
                  id={`category-${category.id}`}
                  name="category"
                  value={category.id}
                  checked={selectedCategory === category.id.toString()}
                  onChange={() => onCategoryChange(category.id.toString())}
                />
                <label htmlFor={`category-${category.id}`}>{category.name}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;