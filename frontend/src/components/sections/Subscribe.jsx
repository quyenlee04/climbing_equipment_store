import React from 'react';
import backpackIcon from '../../assets/images/vector_smart_object_11.png';
import compassIcon from '../../assets/images/vector_smart_object_5.png';

const Subscribe = () => {
  return (
    <section className="subscribe-section">
      <div className="subscribe-container">
        <h2 className="subscribe-title">Subscribe</h2>
        <p className="subscribe-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Vivamus lacinia odio vitae vestibulum vestibulum.
        </p>
        
        <div className="subscribe-form">
          <input 
            type="email" 
            className="email-input" 
            placeholder="Your Email" 
          />
          <button className="subscribe-button">Subscribe</button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <img src={backpackIcon} alt="" className="decor-item decor-backpack" style={{top: '30%', left: '15%'}} />
      <img src={compassIcon} alt="" className="decor-item decor-backpack" style={{bottom: '20%', right: '10%'}} />
    </section>
  );
};

export default Subscribe;