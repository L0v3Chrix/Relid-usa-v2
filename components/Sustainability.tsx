import React from 'react';
import Section from './ui/Section';
import { Ban, Globe } from 'lucide-react';

const Sustainability: React.FC = () => {
  return (
    <Section id="sustainability" className="bg-brand-black text-white border-t border-white/10">
      <div className="text-center mb-10 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3 sm:mb-4 text-white">
          Sustainability <span className="text-brand-green">That Sells</span>
        </h2>
        <p className="text-base sm:text-lg text-brand-gray max-w-2xl mx-auto">
          Your customers care about environmental impact — and so do retailers.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
        {/* Visual: Circular Economy Graphic */}
        <div className="flex-1 relative flex justify-center order-2 lg:order-1">
          <img
            src="/images/circular-economy.png"
            alt="Aluminum Circular Economy - Cans are recycled into new aluminum and made into new cans"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl sm:rounded-2xl shadow-xl"
          />
        </div>

        <div className="flex-1 space-y-6 sm:space-y-8 lg:space-y-10 order-1 lg:order-2">
          <p className="text-base sm:text-lg md:text-xl text-brand-gray leading-relaxed font-medium">
            ReLid delivers a sustainability story that strengthens your brand positioning while reducing packaging complexity and waste.
          </p>

          <div className="space-y-5 sm:space-y-6 md:space-y-8">
            <div className="flex gap-4 sm:gap-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-green rounded flex items-center justify-center text-brand-black shrink-0 font-bold text-lg sm:text-xl">
                Al
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 text-white">Infinitely Recyclable</h3>
                <p className="text-sm sm:text-base text-brand-gray">The entire ReLid mechanism is aluminum — no mixed materials. Just clean, circular packaging.</p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-green rounded flex items-center justify-center text-brand-black shrink-0">
                <Ban size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 text-white">Eliminates Plastic Components</h3>
                <p className="text-sm sm:text-base text-brand-gray">Replace plastic caps, shrink bands, and secondary closures with a single aluminum solution.</p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-green rounded flex items-center justify-center text-brand-black shrink-0">
                <Globe size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 text-white">Close the Loop</h3>
                <p className="text-sm sm:text-base text-brand-gray">Aluminum recycles infinitely without quality loss. A story consumers, retailers, and stakeholders want to hear.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-white/10">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-brand-green">"A packaging decision that benefits your brand, your customers, and the planet."</span>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Sustainability;
