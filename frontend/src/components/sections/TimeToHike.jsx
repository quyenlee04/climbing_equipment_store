import React from 'react';
import hikerImage from '../../assets/images/mask_2.png';
import decorIcon from '../../assets/images/vector_smart_object_11.png';

const TimeToHike = () => {
  return (
    <div className="time-to-hike-section">
      <div className="background-6">
        <img 
          className="vector-smart-object-15" 
          src={decorIcon} 
          alt="Decoration" 
          width="98" 
          height="114" 
        />
        <div className="row-6 group">
          <img 
            className="mask-5" 
            src={hikerImage} 
            alt="Hiker" 
          />
          <div className="col-3-2">
            <div className="text-11">
              <p className="title-16">Time to Hike</p>
              <p className="body-text-16">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Vivamus lacinia odio vitae vestibulum vestibulum.
              </p>
            </div>
            <div className="button-3">
              Reservation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeToHike;