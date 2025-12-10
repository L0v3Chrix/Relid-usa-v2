import React from 'react';
import Section from './ui/Section';
import { Activity } from 'lucide-react';
import { BENEFITS } from '../constants';
import Button from './ui/Button';

// Map to actual can images (PNG with transparent backgrounds)
const imageMap: Record<string, string> = {
  Coffee: '/images/coffee-can.png',
  Zap: '/images/energy-can.png',
  Droplets: '/images/water-can.png',
  Wine: '/images/beer-can.png',
};

const ProductBenefits: React.FC = () => {
  return (
    <Section id="product-benefits" className="bg-brand-black text-white border-t border-white/10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
          Upgrade Your Product. <br/>
          <span className="text-brand-green">Elevate Your Brand.</span>
        </h2>
        <p className="text-xl text-brand-gray max-w-3xl mx-auto font-medium">
          ReLid USA works with every major beverage category, giving brands a premium, resealable experience without changing their can format.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {BENEFITS.map((benefit) => (
          <div key={benefit.category} className="group p-8 border border-white/10 rounded-2xl hover:border-brand-green hover:shadow-2xl hover:shadow-brand-green/10 transition-all duration-300 bg-white/5 hover:bg-white/10 text-center flex flex-col items-center">
            <div className="mb-6 h-32 w-32 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img
                src={imageMap[benefit.iconName] || '/images/coffee-can.png'}
                alt={`${benefit.category} can illustration`}
                className="h-full w-auto object-contain"
              />
            </div>
            <h3 className="text-2xl font-heading font-bold mb-3 text-white">{benefit.category}</h3>
            <p className="text-brand-gray leading-relaxed text-sm">{benefit.text}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-brand-green/20 rounded-full text-brand-green hidden sm:block">
            <Activity size={32} />
          </div>
          <div className="text-white text-left">
            <h4 className="text-xl font-bold mb-1">Seamless Integration</h4>
            <p className="text-brand-gray">Compatible with your existing filling line.</p>
          </div>
        </div>
        <Button variant="primary">Compatible With Your Existing Filling Line</Button>
      </div>
    </Section>
  );
};

export default ProductBenefits;