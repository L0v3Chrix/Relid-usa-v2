import React from 'react';
import Section from './ui/Section';
import { Hammer, Thermometer, Shield, Lock, Zap } from 'lucide-react';

const Durability: React.FC = () => {
  return (
    <Section id="durability" className="bg-brand-black relative text-white">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <span className="text-brand-red font-bold tracking-widest uppercase mb-2 block border-b-2 border-brand-red w-fit pb-1">USA Exclusive</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Built for Real Life. <br/> Tested for America.
          </h2>
          <p className="text-brand-gray text-lg mb-8 leading-relaxed">
             From work sites to gyms to weekend adventures, the ReLid USA mechanism is engineered to perform under real pressure, real movement, and real conditions.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Shield className="text-brand-green shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-white font-bold text-lg">Scratch Resistant</h4>
                <p className="text-sm text-brand-gray">High‑grade aluminum maintains a clean, premium look.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <Zap className="text-brand-green shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-white font-bold text-lg">Pressure Tested</h4>
                <p className="text-sm text-brand-gray">Designed to withstand carbonated beverages and repeated opening cycles.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Hammer className="text-brand-green shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-white font-bold text-lg">Drop Impact Ready</h4>
                <p className="text-sm text-brand-gray">Secure reseal mechanism stays locked even when life gets loud.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <Thermometer className="text-brand-green shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-white font-bold text-lg">Thermal Stability</h4>
                <p className="text-sm text-brand-gray">Hot or cold, the lid retains integrity and smooth performance.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <Lock className="text-brand-green shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-white font-bold text-lg">Reseal Strength</h4>
                <p className="text-sm text-brand-gray">Proven airtight closure protects freshness between uses.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 mt-8 lg:mt-0">
           {/* Exploded View Diagram */}
          <div className="bg-white rounded-2xl p-6 border border-white/20 shadow-xl">
             <img
                src="/images/exploded-lid.png"
                alt="ReLid USA Exploded 3D View - Three-layer construction with top lid, green gasket seal ring, and sliding mechanism base"
                className="w-full h-auto rounded-xl"
             />
          </div>

          {/* USA Product Image */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
             <img
                src="/images/usa-relid.png"
                alt="ReLid USA Premium Matte Black Lid with American Flag Tab Design"
                className="w-full max-w-xs mx-auto h-auto rounded-xl"
             />
             <div className="mt-4 text-center">
                <span className="bg-brand-green text-brand-black font-bold px-4 py-2 rounded text-sm uppercase tracking-wider">Made in USA</span>
             </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-white font-bold text-lg">"American durability meets modern engineering."</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Durability;