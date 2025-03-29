import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductList from '../components/products/ProductList';

const ProductsPage = () => {
  return (
    <div className="products-page">
      <Header />
      <div className="page-content">
        <ProductList />
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;