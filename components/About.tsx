import React from 'react';
import Section from './ui/Section';

const About: React.FC = () => {
  return (
    <Section id="about" className="bg-brand-black border-t border-white/10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 relative">
           <div className="rounded-2xl overflow-hidden border border-white/10 relative group">
              <img
                src="/images/factory.png"
                alt="ReLid USA Manufacturing Facility - Real factory floor with RE→LID USA banner, workers, and conveyor line producing resealable aluminum can lids"
                className="w-full h-auto"
              />

              <div className="absolute bottom-4 left-4 bg-brand-green text-brand-black text-xs font-bold px-3 py-1.5 uppercase rounded">
                Saint Charles, IL
              </div>
           </div>
        </div>

        <div className="order-1 lg:order-2 space-y-8">
           <h2 className="text-4xl font-heading font-bold text-white">Engineering the Future of Resealable Packaging</h2>
           
           <div className="text-brand-gray space-y-6 text-lg leading-relaxed">
             <p>
               ReLid USA brings proven European innovation to the American market through a strategic license from ReLid Europe, the pioneers of resealable aluminum can‑end technology.
             </p>
             <p>
               Our U.S. expansion includes domestic production capabilities, Chicago‑based scaling, and machinery engineered for high‑volume output.
             </p>
           </div>

           <div className="grid grid-cols-1 gap-4 pt-4">
             <div className="pl-4 border-l-2 border-brand-green">
               <span className="block text-xl font-bold text-white mb-1">European Innovation, American Execution</span>
               <span className="text-sm text-brand-gray">Combining global expertise with U.S. manufacturing power.</span>
             </div>
             <div className="pl-4 border-l-2 border-brand-green">
               <span className="block text-xl font-bold text-white mb-1">Next‑Gen Machinery</span>
               <span className="text-sm text-brand-gray">Designed for precision, speed, and reliability.</span>
             </div>
             <div className="pl-4 border-l-2 border-brand-green">
               <span className="block text-xl font-bold text-white mb-1">Built for Today’s Brands</span>
               <span className="text-sm text-brand-gray">Ready for coffee, energy, alcohol, water, and beyond.</span>
             </div>
           </div>

           <p className="text-white font-bold text-lg pt-4">A smarter lid for a smarter market.</p>
        </div>
      </div>
    </Section>
  );
};

export default About;