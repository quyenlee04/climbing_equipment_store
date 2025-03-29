import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductDetail from '../components/products/ProductDetail';

const ProductDetailPage = () => {
  return (
    <div className="product-detail-page">
      <Header />
      <div className="page-content">
        <ProductDetail />
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;