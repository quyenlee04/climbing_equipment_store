import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductDetail from '../components/products/ProductDetail';

const ProductDetailPage = () => {
  const { id } = useParams();
  return (
    <div className="product-detail-page">

      <div className="page-content">
        <ProductDetail productId={id} />
      </div>

    </div>
  );
};

export default ProductDetailPage;