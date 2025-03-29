import React from 'react';
import cameraIcon from '../../assets/images/vector_smart_object_7.png';
import decorIcon1 from '../../assets/images/vector_smart_object_5.png';
import decorIcon2 from '../../assets/images/vector_smart_object_3.png';

const Statistics = () => {
  return (
    <div className="statistics-section">
      <div className="design-3">
        <div className="row-2 group">
          <img 
            className="vector-smart-object-12" 
            src={cameraIcon} 
            alt="Camera icon" 
            width="160" 
            height="141" 
          />
          <div className="text-10">
            <p className="title-12">Statistics</p>
            <p className="body-text-12">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Vivamus lacinia odio vitae vestibulum vestibulum.
            </p>
          </div>
        </div>
        
        <div className="row-3 match-height group">
          <div className="card-4">
            <p className="title-13">123</p>
            <p className="body-text-13">STORE</p>
          </div>
          <div className="card-5">
            <p className="title-14">100</p>
            <p className="body-text-14">MENU</p>
          </div>
        </div>
        
        <div className="row-4 group">
          <img 
            className="vector-smart-object-13" 
            src={decorIcon1} 
            alt="Decoration" 
            width="190" 
            height="147" 
          />
          <img 
            className="vector-smart-object-14" 
            src={decorIcon2} 
            alt="Decoration" 
            width="210" 
            height="190" 
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;