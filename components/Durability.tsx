import React from 'react';
import Section from './ui/Section';
import { Hammer, Thermometer, Shield, Lock, Zap } from 'lucide-react';

const Durability: React.FC = () => {
  const techPoints = [
    {
      icon: Shield,
      title: 'Shelf-Ready Durability',
      desc: 'Premium-grade aluminum resists scratches through distribution, retail handling, and consumer use. Your branding stays pristine.'
    },
    {
      icon: Zap,
      title: 'Carbonation Integrity',
      desc: 'Engineered to maintain seal integrity through carbonation pressure, temperature fluctuations, and hundreds of open-close cycles.'
    },
    {
      icon: Hammer,
      title: 'Built for Distribution',
      desc: 'Our mechanism maintains seal integrity through shipping, retail stocking, and consumer handling. No leaks. No failures.'
    },
    {
      icon: Thermometer,
      title: 'Temperature Extremes',
      desc: 'From refrigerated retail to hot car interiors, ReLid maintains smooth operation and airtight seal across temperature swings.'
    },
    {
      icon: Lock,
      title: 'Freshness Protection',
      desc: 'Airtight reseal mechanism preserves product integrity between uses — protecting flavor, carbonation, and consumer experience.'
    },
  ];

  return (
    <Section id="durability" className="bg-brand-black relative text-white">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
        <div>
          <span className="text-brand-green font-bold tracking-widest uppercase mb-2 block border-b-2 border-brand-green w-fit pb-1 text-xs sm:text-sm">
            American-Made | European-Engineered
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 sm:mb-6">
            Performance You Can <br className="hidden sm:block"/>
            <span className="text-brand-green">Promise Your Customers</span>
          </h2>
          <p className="text-brand-gray text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
            Your brand reputation rides on every consumer interaction. ReLid technology is engineered to perform flawlessly — whether it's a morning commute, a gym session, or a weekend adventure.
          </p>

          <div className="space-y-4 sm:space-y-6">
            {techPoints.map((point) => (
              <div key={point.title} className="flex items-start gap-3 sm:gap-4">
                <point.icon className="text-brand-green shrink-0 mt-1 w-5 h-5 sm:w-6 sm:h-6" />
                <div>
                  <h4 className="text-white font-bold text-base sm:text-lg">{point.title}</h4>
                  <p className="text-xs sm:text-sm text-brand-gray">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8 mt-4 lg:mt-0">
          {/* ReLid USA Branded Can */}
          <div className="p-2 sm:p-4 flex justify-center">
            <img
              src="/images/relid-can.png"
              alt="ReLid USA Premium Aluminum Can with Resealable Sliding Lid Technology"
              className="w-auto h-auto max-h-[280px] sm:max-h-[350px] md:max-h-[400px] drop-shadow-2xl"
            />
          </div>

          {/* USA Product Image */}
          <div className="bg-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-sm">
            <img
              src="/images/usa-relid.png"
              alt="ReLid USA Premium Matte Black Lid with American Flag Tab Design"
              className="w-full max-w-xs mx-auto h-auto rounded-lg sm:rounded-xl"
            />
            <div className="mt-3 sm:mt-4 text-center">
              <span className="bg-brand-green text-brand-black font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm uppercase tracking-wider">Made in USA</span>
            </div>
          </div>

          <div className="text-center pt-2 sm:pt-4">
            <p className="text-white font-bold text-base sm:text-lg">"European precision. American production. Uncompromising quality."</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Durability;
