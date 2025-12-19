import React from 'react';
import Section from './ui/Section';
import { TALKING_POINTS } from '../constants';
import { Check } from 'lucide-react';

const TalkingPoints: React.FC = () => {
  return (
    <Section id="talking-points" className="bg-brand-black text-white border-t border-white/10">
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mb-4 sm:mb-6 text-white">
            Why Leading Brands Are <span className="text-brand-green">Making the Switch</span>
          </h2>
          <p className="text-base sm:text-lg text-brand-gray mb-6 sm:mb-8 leading-relaxed">
            Resealability isn't just a feature — it's a competitive advantage. ReLid delivers measurable benefits for your brand, your bottom line, and your customers.
          </p>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-white border-l-4 sm:border-l-8 border-brand-green pl-4 sm:pl-6 py-3 sm:py-4">
            "The single biggest packaging upgrade your brand can make this year."
          </div>
        </div>

        <div className="bg-white/5 p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg border border-white/10">
          <ul className="space-y-4 sm:space-y-5">
            {TALKING_POINTS.map((point) => (
              <li key={point.title} className="flex items-start gap-3 sm:gap-4">
                <div className="bg-brand-green/20 p-1 rounded-full text-brand-green mt-0.5 sm:mt-1 shrink-0">
                  <Check size={16} className="sm:w-5 sm:h-5" strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg md:text-xl mb-0.5 sm:mb-1 text-white">{point.title}</h4>
                  <p className="text-xs sm:text-sm text-brand-gray">{point.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default TalkingPoints;
