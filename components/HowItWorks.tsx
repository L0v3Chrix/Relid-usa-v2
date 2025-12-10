import React from 'react';
import Section from './ui/Section';

const HowItWorks: React.FC = () => {
  // Using image labels per user decision: LIFT, PUSH, RE-LID
  const steps = [
    {
      id: 1,
      title: 'Lift',
      desc: 'Lift the engineered tab to release the seal.',
      image: '/images/how-to-step1-lift.png',
    },
    {
      id: 2,
      title: 'Slide',
      desc: 'A smooth gliding mechanism reveals the opening.',
      image: '/images/how-to-step2-slide.png',
    },
    {
      id: 3,
      title: 'Re-Lid',
      desc: 'Press and lock the tab to restore airtight protection.',
      image: '/images/how-to-step3-reseal.png',
    },
  ];

  return (
    <Section id="how-it-works" className="bg-brand-black border-t border-white/10">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">Simple. Smooth. Intuitive.</h2>
        <p className="text-brand-gray text-lg font-medium max-w-2xl mx-auto">
          Designed for durability, comfort, and repeat use.
        </p>
      </div>

      {/* Three-Panel Instruction Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-brand-green/50 transition-all duration-300">
              {/* Step Image */}
              <div className="w-full aspect-square mb-6 overflow-hidden rounded-xl">
                <img
                  src={step.image}
                  alt={`Step ${step.id}: ${step.title}`}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Step Number & Text */}
              <span className="text-4xl font-heading font-bold text-brand-green mb-2">0{step.id}</span>
              <h3 className="text-2xl font-heading font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-brand-gray">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default HowItWorks;