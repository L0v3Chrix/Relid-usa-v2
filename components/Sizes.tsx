import React from 'react';
import Section from './ui/Section';
import { SIZES } from '../constants';

const Sizes: React.FC = () => {
  return (
    <Section id="sizes" className="bg-brand-black text-white border-t border-white/10">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">One Lid. <br />Multiple Formats.</h2>
          <p className="text-brand-gray max-w-xl text-lg">
            ReLid USA is available for standard and slim U.S. can formats, offering flexibility for any beverage brand.
          </p>
        </div>
        <div className="bg-brand-green px-6 py-3 rounded text-brand-black font-bold text-sm uppercase tracking-wide">
          More sizes coming soon
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-end justify-items-center">
        {SIZES.map((size) => (
          <div key={size.name} className="flex flex-col items-center group w-full">
            {/* Can Graphic CSS Representation */}
            <div className={`relative ${size.width} ${size.height} bg-gradient-to-r from-white/10 to-white/5 border-2 border-white/20 rounded-t-2xl rounded-b-xl mb-6 transition-all duration-500 group-hover:-translate-y-4 group-hover:border-brand-green/50 shadow-xl`}>
              {/* Lid Area */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-brand-green/30 border-b border-white/20 rounded-t-xl"></div>
              {/* Label Area (Decorative) */}
              <div className="absolute top-1/2 left-1 right-1 h-8 border-t border-b border-white/10 flex items-center justify-center">
              </div>
            </div>

            <h3 className="text-lg font-heading font-bold mb-2 text-white">{size.name}</h3>
            <p className="text-sm text-brand-gray text-center px-2">{size.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Sizes;