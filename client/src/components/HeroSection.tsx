import React from 'react';
import { Link } from 'react-router-dom';
import heroBackground from '../assets/Background.webp';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <img
        src={heroBackground}
        alt="Tiko Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-r from-black/10 to-transparent" />

      {/* Content Card */}
      <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-10 max-w-sm sm:max-w-md shadow-xl">
          <h1 className="font-outfit font-bold text-3xl sm:text-4xl text-tiko-primary leading-snug mb-4">
            Curated for your home,
          </h1>
          <p className="text-sm sm:text-base text-tiko-on-surface-variant leading-relaxed mb-8">
            Experience quiet luxury and neighborhood warmth through our thoughtfully selected pieces, delivered directly from our heart to your doorstep.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/shop"
              className="px-6 py-3 bg-tiko-primary text-white font-outfit font-bold text-sm rounded-full hover:bg-tiko-primary/90 active:scale-[0.98] transition-all shadow-md shadow-tiko-primary/20"
            >
              SHOP THE COLLECTION
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 border-2 border-tiko-on-surface text-tiko-on-surface font-outfit font-bold text-sm rounded-full hover:bg-tiko-on-surface/5 transition-all"
            >
              OUR STORY
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
