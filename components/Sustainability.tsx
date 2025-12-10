import React from 'react';
import Section from './ui/Section';
import { Ban, Globe } from 'lucide-react';

const Sustainability: React.FC = () => {
  return (
    <Section id="sustainability" className="bg-brand-black text-white border-t border-white/10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">Better for Consumers.<br/>Better for the Planet.</h2>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-16">

        {/* Visual: Circular Economy Graphic */}
        <div className="flex-1 relative flex justify-center order-2 lg:order-1">
          <img
            src="/images/circular-economy.png"
            alt="Aluminum Circular Economy - Cans are recycled into new aluminum and made into new cans"
            className="w-full max-w-md rounded-2xl shadow-xl"
          />
        </div>

        <div className="flex-1 space-y-10 order-1 lg:order-2">
           <p className="text-xl text-brand-gray leading-relaxed font-medium">
             Aluminum is the most recycled material in the world — and ReLid USA takes that circular impact even further. By replacing single‑use plastic closures and enabling reusable sealing, the ReLid system reduces waste while increasing product life and consumer satisfaction.
           </p>

           <div className="space-y-8">
             <div className="flex gap-5">
                <div className="w-12 h-12 bg-brand-green rounded flex items-center justify-center text-brand-black shrink-0 font-bold text-xl">
                  Al
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-white">100% Aluminum Construction</h3>
                  <p className="text-brand-gray">Fully recyclable and environmentally responsible.</p>
                </div>
             </div>

             <div className="flex gap-5">
                <div className="w-12 h-12 bg-brand-green rounded flex items-center justify-center text-brand-black shrink-0">
                  <Ban size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-white">Reduces Single‑Use Plastics</h3>
                  <p className="text-brand-gray">No caps, no shrink bands, no additional closures.</p>
                </div>
             </div>

             <div className="flex gap-5">
                <div className="w-12 h-12 bg-brand-green rounded flex items-center justify-center text-brand-black shrink-0">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-white">Supports the Circular Economy</h3>
                  <p className="text-brand-gray">Every lid can be recycled and reborn as new aluminum.</p>
                </div>
             </div>
           </div>

           <div className="pt-6 border-t border-white/10">
             <span className="text-2xl font-bold text-brand-green">"A small change with a massive impact."</span>
           </div>
        </div>
      </div>
    </Section>
  );
};

export default Sustainability;