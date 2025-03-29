import React from 'react';

const Statistics = () => {
  return (
    <div className="design-3">
      <div className="row-2 group">
        <div className="camera-icon">
          {/* Camera icon SVG */}
          <svg width="160" height="141" viewBox="0 0 160 141" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 110C97.6731 110 112 95.6731 112 78C112 60.3269 97.6731 46 80 46C62.3269 46 48 60.3269 48 78C48 95.6731 62.3269 110 80 110Z" fill="#8D6E63"/>
            <path d="M140 30H112L104 14H56L48 30H20C8.95 30 0 38.95 0 50V122C0 133.05 8.95 142 20 142H140C151.05 142 160 133.05 160 122V50C160 38.95 151.05 30 140 30ZM80 118C58.95 118 42 101.05 42 80C42 58.95 58.95 42 80 42C101.05 42 118 58.95 118 80C118 101.05 101.05 118 80 118Z" fill="#A1887F"/>
          </svg>
        </div>
        <div className="text-10">
          <p className="title-12">Statistics</p>
          <p className="body-text-12">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
        </div>
      </div>
      <div className="row-3 match-height group">
        <div className="card-4">
          <p className="title-13">123</p>
          <p className="body-text-13">Store</p>
        </div>
        <div className="card-5">
          <p className="title-14">100</p>
          <p className="body-text-14">menu</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;