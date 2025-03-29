import React from 'react';
import hikerImage from '../../assets/images/mask_2.png';
import moneyIcon from '../../assets/images/vector_smart_object_4.png';
import shoeIcon from '../../assets/images/vector_smart_object_5.png';

const TourGuide = () => {
  return (
    <>
      <section className="tour-guide-section">
        <div className="tour-guide-container">
          <div className="tour-guide-content">
            <h2 className="tour-guide-title">Tour Guide</h2>
            <p className="tour-guide-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus 
              lacinia odio vitae vestibulum vestibulum.
            </p>
            <button className="discount-button">Get Discount</button>
          </div>
          <div className="tour-guide-image">
            <img src={hikerImage} alt="Hiker" />
          </div>
        </div>
        
        {/* Decorative elements */}
        <img src={moneyIcon} alt="" className="decor-item decor-money" style={{top: '20%', left: '10%'}} />
        <img src={moneyIcon} alt="" className="decor-item decor-money" style={{top: '70%', right: '15%'}} />
        <img src={shoeIcon} alt="" className="decor-item decor-shoe" style={{bottom: '10%', left: '20%'}} />
      </section>
      
      <section className="quote-section">
        <div className="quote-container">
          <p className="quote-text">
            "If you are a culinary fan, if you like to spend time in your kitchen, you likely find yourself 
            looking for reliable resources through which you can..."
          </p>
          <p className="quote-author">Phoebe Frazier</p>
        </div>
      </section>
    </>
  );
};

export default TourGuide;