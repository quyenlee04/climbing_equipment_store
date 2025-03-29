import React from 'react';
import mask3 from '../../assets/images/mask_3.png';
import mask4 from '../../assets/images/mask_4.png';
import mask5 from '../../assets/images/mask_5.png';

const FeaturedProducts = () => {
  return (
    <div className="background-4 match-height group">
      <div className="card">
        <img className="mask-2" src={mask3} alt="Product" />
        <div className="text-6">
          <p className="title-8">Title Here</p>
          <p className="body-text-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
      <div className="card-2">
        <img className="mask-3" src={mask4} alt="Product" />
        <div className="text-7">
          <p className="title-9">Title Here</p>
          <p className="body-text-9">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
      <div className="card-3">
        <img className="mask-4" src={mask5} alt="Product" />
        <div className="text-8">
          <p className="title-10">Title Here</p>
          <p className="body-text-10">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;