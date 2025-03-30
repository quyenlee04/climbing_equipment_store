import React from 'react';

import Statistics from '../components/sections/Statistics';
import TimeToHike from '../components/sections/TimeToHike';
import TeamSection from '../components/sections/TeamSection';
import TourGuide from '../components/sections/TourGuide';
import Subscribe from '../components/sections/Subscribe';
import '../styles/styles.css';

const HomePage = () => {
  return (
    <div className="homepage">
      
      <TeamSection />
      <Statistics />
      <TourGuide />
      <TimeToHike />
      <Subscribe />
      
    </div>
  );
};

export default HomePage;