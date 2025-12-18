import React from 'react';
import Section from './ui/Section';
import { Activity } from 'lucide-react';
import Button from './ui/Button';

const ProductBenefits: React.FC = () => {
  // Category descriptions for the can types shown in the image
  const categories = [
    { name: 'Water', desc: 'Keep hydration fresh and portable.' },
    { name: 'Coffee', desc: 'Lock in flavor, enjoy at your pace.' },
    { name: 'Energy', desc: 'Reseal the boost for when you need it.' },
    { name: 'Wine & Spirits', desc: 'Premium experience, preserved.' },
  ];

  return (
    <Section id="product-benefits" className="bg-brand-black text-white border-t border-white/10">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
          Upgrade Your Product. <br/>
          <span className="text-brand-green">Elevate Your Brand.</span>
        </h2>
        <p className="text-xl text-brand-gray max-w-3xl mx-auto font-medium">
          ReLid USA works with every major beverage category, giving brands a premium, resealable experience without changing their can format.
        </p>
      </div>

      {/* Featured Can Types Image */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20">
          <img
            src="/images/can-types.png"
            alt="ReLid USA Compatible Beverage Categories - Water (blue), Coffee (brown), Energy (green), Wine/Grape (burgundy)"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Category Text Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <div key={cat.name} className="text-center p-4">
            <h3 className="text-xl font-heading font-bold mb-2 text-white">{cat.name}</h3>
            <p className="text-sm text-brand-gray">{cat.desc}</p>
          </div>
        ))}
      </div>

      {/* Seamless Integration CTA */}
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
