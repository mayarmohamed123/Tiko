import React from 'react';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import NewArrivalsSection from '../components/NewArrivalsSection';
import BestSellersSection from '../components/BestSellersSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <NewArrivalsSection />
      <BestSellersSection />
    </>
  );
};

export default HomePage;
