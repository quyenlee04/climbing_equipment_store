import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Statistics from '../components/sections/Statistics';
import TimeToHike from '../components/sections/TimeToHike';
import TeamSection from '../components/sections/TeamSection';
import TourGuide from '../components/sections/TourGuide';
import Subscribe from '../components/sections/Subscribe';

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />
      <TeamSection />
      <Statistics />
      <TourGuide />
      <TimeToHike />
      <Subscribe />
      <Footer />
    </div>
  );
};

export default HomePage;