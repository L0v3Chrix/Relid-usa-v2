import React from 'react';
import Section from './ui/Section';

const Sizes: React.FC = () => {
  const sizes = [
    {
      name: 'Standard',
      subtitle: 'The Workhorse Format',
      desc: "America's most popular can size. Perfect for mass-market beverages, functional drinks, and mainstream energy."
    },
    {
      name: 'Sleek',
      subtitle: 'Premium Positioning',
      desc: 'The sleek format signals quality. Ideal for craft beverages, premium RTD coffee, and upscale retail placement.'
    },
    {
      name: 'Slim',
      subtitle: 'Built for Performance',
      desc: 'The go-to format for energy, performance, and functional shot beverages. High velocity, high margin.'
    },
  ];

  return (
    <Section id="sizes" className="bg-brand-black text-white border-t border-white/10">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3 sm:mb-4 text-white">
            Format Flexibility for <br className="hidden sm:block"/>
            <span className="text-brand-green">Every Product Line</span>
          </h2>
          <p className="text-brand-gray max-w-xl text-base sm:text-lg">
            ReLid fits the can formats you're already running — no tooling changes, no line disruptions, no delays to market.
          </p>
        </div>
        <div className="bg-brand-green px-4 sm:px-6 py-2 sm:py-3 rounded text-brand-black font-bold text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">
          202 & 200 End Sizes
        </div>
      </div>

      {/* Real Can Sizes Image */}
      <div className="max-w-4xl mx-auto">
        <div className="p-2 sm:p-4 md:p-8">
          <img
            src="/images/can-sizes.png"
            alt="ReLid USA Available Can Sizes - STANDARD (traditional 12oz), SLEEK (taller slim design), SLIM (tallest energy drink format)"
            className="w-full h-auto"
          />
        </div>

        {/* Size Descriptions - FIXED: Mobile responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-10">
          {sizes.map((size) => (
            <div key={size.name} className="text-center p-4 bg-white/5 rounded-xl border border-white/10 sm:bg-transparent sm:border-0 sm:p-0">
              <h3 className="text-lg sm:text-xl font-heading font-bold mb-1 text-white">{size.name}</h3>
              <p className="text-brand-green font-semibold text-sm mb-2">{size.subtitle}</p>
              <p className="text-xs sm:text-sm text-brand-gray">{size.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Sizes;
