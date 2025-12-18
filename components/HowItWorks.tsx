import React from 'react';
import Section from './ui/Section';

const HowItWorks: React.FC = () => {
  return (
    <Section id="how-it-works" className="bg-brand-black border-t border-white/10">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">Simple. Smooth. Intuitive.</h2>
        <p className="text-brand-gray text-lg font-medium max-w-2xl mx-auto">
          Designed for durability, comfort, and repeat use.
        </p>
      </div>

      {/* Single Unified 4-Step Instruction Image */}
      <div className="max-w-5xl mx-auto">
        <div className="p-4 md:p-8">
          <img
            src="/images/how-it-works.png"
            alt="ReLid USA 4-Step Process: Step 1 - Start CLOSED, Step 2 - LIFT TAB END, Step 3 - SLIDE BACK TO DRINK, Step 4 - SLIDE FORWARD TO RESEAL"
            className="w-full h-auto"
          />
        </div>

        {/* Supporting Text */}
        <p className="text-center text-brand-gray mt-8 text-lg max-w-2xl mx-auto">
          The ReLid mechanism glides open and locks shut with smooth precision — engineered to perform
          under real pressure, real movement, and real conditions.
        </p>
      </div>
    </Section>
  );
};

export default HowItWorks;
