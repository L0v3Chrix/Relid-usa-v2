import React from 'react';
import Section from './ui/Section';

const Sizes: React.FC = () => {
  return (
    <Section id="sizes" className="bg-brand-black text-white border-t border-white/10">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
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

      {/* Real Can Sizes Image */}
      <div className="max-w-4xl mx-auto">
        <div className="p-4 md:p-8">
          <img
            src="/images/can-sizes.png"
            alt="ReLid USA Available Can Sizes - STANDARD (traditional 12oz), SLEEK (taller slim design), SLIM (tallest energy drink format)"
            className="w-full h-auto"
          />
        </div>

        {/* Size Descriptions */}
        <div className="grid grid-cols-3 gap-8 mt-10 text-center">
          <div>
            <h3 className="text-xl font-heading font-bold mb-2 text-white">Standard</h3>
            <p className="text-sm text-brand-gray">Classic 12oz format — the American staple.</p>
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold mb-2 text-white">Sleek</h3>
            <p className="text-sm text-brand-gray">Taller, modern profile for premium brands.</p>
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold mb-2 text-white">Slim</h3>
            <p className="text-sm text-brand-gray">Energy-sized format for high-volume beverages.</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Sizes;
