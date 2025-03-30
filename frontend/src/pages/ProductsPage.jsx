import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductList from '../components/products/ProductList';

const ProductsPage = () => {
  return (
    <div className="products-page">

      <div className="page-content">
        <ProductList />
      </div>

    </div>
  );
};

export default ProductsPage;