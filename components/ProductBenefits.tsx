import React from 'react';
import Section from './ui/Section';
import { Activity } from 'lucide-react';
import Button from './ui/Button';

const ProductBenefits: React.FC = () => {
  // Category descriptions reframed for B2B with consumer secondary benefits
  const categories = [
    {
      name: 'Water & Functional',
      headline: 'Capture the premium hydration market.',
      desc: 'Give health-conscious consumers a reason to choose — and repurchase — your brand.'
    },
    {
      name: 'RTD Coffee',
      headline: 'Protect flavor integrity.',
      desc: 'Resealability locks in freshness, positioning your brand as the quality choice.'
    },
    {
      name: 'Energy & Performance',
      headline: 'Extend the brand relationship.',
      desc: 'High-performance consumers want control. Resealability creates utility advantage.'
    },
    {
      name: 'Wine & Spirits',
      headline: 'Deliver premium experiences.',
      desc: 'The premium seal that justifies craft pricing in canned formats.'
    },
  ];

  return (
    <Section id="product-benefits" className="bg-brand-black text-white border-t border-white/10">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 text-white">
          One Technology. <br className="sm:hidden"/>
          <span className="text-brand-green">Endless Market Opportunities.</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-brand-gray max-w-3xl mx-auto font-medium">
          ReLid integrates with your existing production line to unlock premium positioning across every beverage category — from functional hydration to craft spirits.
        </p>
      </div>

      {/* Featured Can Types Image */}
      <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
        <div className="p-2 sm:p-4 md:p-8">
          <img
            src="/images/can-types.png"
            alt="ReLid USA Compatible Beverage Categories - Water (blue), Coffee (brown), Energy (green), Wine/Grape (burgundy)"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Category Text Grid - B2B Focused */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16 max-w-5xl mx-auto">
        {categories.map((cat) => (
          <div key={cat.name} className="text-center p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg sm:text-xl font-heading font-bold mb-1 text-white">{cat.name}</h3>
            <p className="text-brand-green font-semibold text-sm mb-2">{cat.headline}</p>
            <p className="text-xs sm:text-sm text-brand-gray">{cat.desc}</p>
          </div>
        ))}
      </div>

      {/* Seamless Integration CTA */}
      <div className="bg-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 border border-white/10">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="p-3 sm:p-4 bg-brand-green/20 rounded-full text-brand-green hidden sm:block">
            <Activity size={28} className="sm:w-8 sm:h-8" />
          </div>
          <div className="text-white text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold mb-1">Ready for Your Line. Today.</h4>
            <p className="text-sm sm:text-base text-brand-gray">Zero modifications required. Our team handles integration support from first sample to full production.</p>
          </div>
        </div>
        <Button variant="primary" href="#contact" className="w-full md:w-auto whitespace-nowrap">Start Integration Conversation</Button>
      </div>
    </Section>
  );
};

export default ProductBenefits;
