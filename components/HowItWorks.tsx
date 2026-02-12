import React from 'react';
import Section from './ui/Section';

const HowItWorks: React.FC = () => {
  return (
    <Section id="how-it-works" className="bg-brand-black border-t border-white/10">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 sm:mb-6 text-white">
          Engineered for <span className="text-brand-green">Repeat Performance</span>
        </h2>
        <p className="text-brand-gray text-base sm:text-lg font-medium max-w-2xl mx-auto">
          A precision mechanism your customers will use — and appreciate — every time they reach for your brand.
        </p>
      </div>

      {/* Single Unified 4-Step Instruction Image */}
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Light gradient container - precise 5px padding */}
          <div className="relative bg-gradient-to-b from-slate-100 via-gray-50 to-slate-200" style={{ padding: '5px' }}>
            {/* Subtle inner highlight for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,_rgba(255,255,255,0.8)_0%,_transparent_50%)]"></div>
            {/* Image with cropped whitespace */}
            <div className="relative z-10 overflow-hidden" style={{ marginTop: '-8%', marginBottom: '-18%' }}>
              <img
                src="/images/STEP-1-START-CLOSED-Final.png"
                alt="ReLid USA 4-Step Process: Step 1 - Start CLOSED, Step 2 - LIFT TAB END, Step 3 - SLIDE BACK TO DRINK, Step 4 - SLIDE FORWARD TO RESEAL"
                className="w-full h-auto drop-shadow-lg"
              />
            </div>
          </div>
          {/* Subtle green accent border */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-1 ring-inset ring-brand-green/20 pointer-events-none"></div>
        </div>

        {/* Supporting Text */}
        <div className="mt-6 sm:mt-8 space-y-4 max-w-2xl mx-auto text-center">
          <p className="text-brand-gray text-base sm:text-lg">
            The patented ReLid sliding mechanism operates with smooth, confident precision. Lift the tab, slide to drink, slide to reseal. Intuitive for first-time users, durable for mobile consumers.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default HowItWorks;
