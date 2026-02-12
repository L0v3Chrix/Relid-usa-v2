import React from 'react';
import Section from './ui/Section';

const Sizes: React.FC = () => {
  const sizes = [
    {
      name: 'Standard',
      subtitle: 'The Workhorse Format',
      desc: "America's most popular can sizes, perfect for mass market beverage, functional drinks, and mainstream energy."
    },
    {
      name: 'Sleek',
      subtitle: 'Premium Positioning',
      desc: 'Ideal for RTD cocktails, premium water, and upscale retail replacement.'
    },
    {
      name: 'Large',
      subtitle: '16/24 Ounce Formats',
      desc: 'The go-to format for RTDs, energy, beer, and hydration beverages.'
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
        <div className="bg-brand-green/20 border border-brand-green/40 px-4 sm:px-6 py-2 sm:py-3 rounded text-brand-green font-bold text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">
          202 & 206 End Sizes
        </div>
      </div>

      {/* Real Can Sizes Image */}
      <div className="max-w-4xl mx-auto">
        <div className="p-2 sm:p-4 md:p-8">
          <img
            src="/images/can-sizes.png"
            alt="ReLid USA Available Can Sizes - Standard (traditional 12oz), Sleek (taller slim design), Jumbo (16/24oz large format)"
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
