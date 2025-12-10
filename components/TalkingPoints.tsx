import React from 'react';
import Section from './ui/Section';
import { TALKING_POINTS } from '../constants';
import { Check } from 'lucide-react';

const TalkingPoints: React.FC = () => {
  return (
    <Section id="talking-points" className="bg-brand-black text-white border-t border-white/10">
       <div className="grid lg:grid-cols-2 gap-12 items-center">
         <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-heading font-extrabold mb-6 text-white">A Better Experience for Brands and Consumers</h2>
            <p className="text-lg text-brand-gray mb-8 leading-relaxed">
              ReLid USA transforms traditional cans into reusable, resealable, premium packaging with benefits that matter:
            </p>
            <div className="text-3xl font-bold font-heading text-white border-l-8 border-brand-green pl-6 py-4">
              "A simple change that makes every can better."
            </div>
         </div>

         <div className="bg-white/5 p-8 md:p-12 rounded-lg border border-white/10">
           <ul className="space-y-6">
             {TALKING_POINTS.map((point) => (
               <li key={point.title} className="flex items-start gap-4">
                 <div className="bg-brand-green/20 p-1 rounded-full text-brand-green mt-1">
                    <Check size={20} strokeWidth={3} />
                 </div>
                 <div>
                   <h4 className="font-bold text-xl mb-1 text-white">{point.title}</h4>
                   <p className="text-brand-gray">{point.text}</p>
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