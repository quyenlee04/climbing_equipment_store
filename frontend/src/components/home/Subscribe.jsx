import React from 'react';
import vectorSmart6 from '../../assets/images/vector_smart_object_6.png';
import vectorSmart4 from '../../assets/images/vector_smart_object_4.png';

const Subscribe = () => {
  return (
    <div className="background-2 group">
      <img className="vector-smart-object-4" src={vectorSmart6} alt="" width="148" height="196" />
      <div className="col-4-2">
        <div className="text-2">
          <p className="title-6">Subscribe</p>
          <p className="body-text-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
        </div>
        <div className="row-7 group">
          <div className="form group">
            <input type="email" placeholder="Your Email" className="text-3" />
            <button className="button">
              Subscribe
            </button>
          </div>
          <img className="vector-smart-object-5" src={vectorSmart4} alt="" width="99" height="115" />
        </div>
      </div>
    </div>
  );
};

export default Subscribe;