import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/SearchBar.css';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit">
        <i className="fa fa-search"></i>
      </button>
    </form>
  );
};

export default SearchBar;