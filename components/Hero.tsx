import React from 'react';
import Button from './ui/Button';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-brand-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/images/relid-video.mp4" type="video/mp4" />
        </video>
        {/* Video Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/70 to-brand-black/50"></div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 pt-24 pb-12">

        {/* Text Overlay Content */}
        <div className="max-w-2xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold leading-tight text-white drop-shadow-lg">
            Re-Lid and <br />
            <span className="text-brand-green">
              Enjoy Later
            </span>
          </h1>

          <h2 className="text-xl md:text-2xl text-white font-medium max-w-lg drop-shadow-md">
            Engineered for freshness, sustainability, and a superior consumer experience.
          </h2>

          <p className="text-base text-white/90 border-l-4 border-brand-green pl-6 py-2 bg-brand-black/30 backdrop-blur-sm rounded-r-lg">
            A stronger, smarter, reusable can lid designed for real‑world conditions and modern American brands.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button href="#how-it-works">
              Explore How It Works
            </Button>
            <Button href="#contact" variant="secondary">
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* Logo - Bottom Right (Doubled Size) */}
      <a
        href="#hero"
        className="absolute bottom-8 right-8 z-20 group hidden md:block"
      >
        <img
          src="/images/relid-logo.png"
          alt="ReLid USA - Resealable Aluminum Can Technology"
          className="h-32 md:h-40 w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-2xl"
        />
      </a>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-black to-transparent z-10"></div>
    </section>
  );
};

export default Hero;