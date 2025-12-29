import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black py-8 sm:py-12 md:py-16 border-t border-white/10 text-center text-sm text-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        {/* New Product Photography */}
        <div className="flex justify-center items-center gap-6 sm:gap-10 mb-6 sm:mb-8">
          <img
            src="/images/green-can-new.png"
            alt="ReLid USA Premium Resealable Aluminum Can"
            className="h-24 sm:h-32 md:h-40 w-auto drop-shadow-lg"
          />
          <a href="#hero" className="opacity-80 hover:opacity-100 transition-opacity">
            <img
              src="/images/relid-logo.png"
              alt="ReLid USA"
              className="h-16 sm:h-20 w-auto"
            />
          </a>
          <img
            src="/images/green-can-top.png"
            alt="ReLid USA Resealable Lid Top View"
            className="h-24 sm:h-32 md:h-40 w-auto drop-shadow-lg"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 font-bold uppercase tracking-wider text-xs">
          <a href="#about" className="hover:text-brand-green transition-colors">About</a>
          <a href="#durability" className="hover:text-brand-green transition-colors">Technology</a>
          <a href="#contact" className="hover:text-brand-green transition-colors">Contact</a>
        </div>

        <div className="pt-6 sm:pt-8 opacity-40 font-light text-xs sm:text-sm">
          <p className="mb-1 sm:mb-2">ReLid USA © 2025 • All Rights Reserved</p>
          <p>Saint Charles, IL, USA</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
