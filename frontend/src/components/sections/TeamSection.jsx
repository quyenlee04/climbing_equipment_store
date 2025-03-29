import React from 'react';
import teamMember1 from '../../assets/images/mask_3.png';
import teamMember2 from '../../assets/images/mask_4.png';
import teamMember3 from '../../assets/images/mask_5.png';
import decorIcon from '../../assets/images/vector_smart_object_5.png';

const TeamSection = () => {
  return (
    <div className="team-section">
      <div className="design-2 group">
        <div className="row-5 group">
          <div className="text-9">
            <p className="title-11">Our Team</p>
            <p className="body-text-11">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Vivamus lacinia odio vitae vestibulum vestibulum.
            </p>
          </div>
          <img 
            className="vector-smart-object-8" 
            src={decorIcon} 
            alt="Decoration" 
            width="190" 
            height="147" 
          />
        </div>
        
        <div className="team-members">
          <div className="card">
            <img 
              className="mask-2" 
              src={teamMember1} 
              alt="Team Member" 
              width="239" 
              height="238" 
            />
            <div className="text-6">
              <p className="title-8">Title Here</p>
              <p className="body-text-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
          
          <div className="card-2">
            <img 
              className="mask-3" 
              src={teamMember2} 
              alt="Team Member" 
              width="239" 
              height="238" 
            />
            <div className="text-7">
              <p className="title-9">Title Here</p>
              <p className="body-text-9">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
          
          <div className="card-3">
            <img 
              className="mask-4" 
              src={teamMember3} 
              alt="Team Member" 
              width="239" 
              height="238" 
            />
            <div className="text-8">
              <p className="title-10">Title Here</p>
              <p className="body-text-10">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;