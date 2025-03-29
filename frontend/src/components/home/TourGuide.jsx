import React from 'react';
import mask from '../../assets/images/mask.png';

const TourGuide = () => {
  return (
    <div className="group-5">
      <div className="content">
        <div className="background-3 group">
          <div className="col">
            <div className="text-4">
              <p className="title-7">Tour Guide</p>
              <p className="body-text-7">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
            </div>
            <div className="button-2">
              Get discount
            </div>
          </div>
          <img className="mask" src={mask} alt="Tour Guide" />
        </div>
      </div>
    </div>
  );
};

export default TourGuide;