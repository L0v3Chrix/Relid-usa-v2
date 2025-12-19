import React from 'react';
import Section from './ui/Section';

const About: React.FC = () => {
  return (
    <Section id="about" className="bg-brand-black border-t border-white/10">
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
        <div className="order-2 lg:order-1 relative">
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 relative group">
            <img
              src="/images/Re-lid-factory-final.png"
              alt="ReLid USA Manufacturing Facility - Real factory floor with RE→LID USA banner, workers, and conveyor line producing resealable aluminum can lids"
              className="w-full h-auto"
            />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-brand-green text-brand-black text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 uppercase rounded">
              Saint Charles, IL
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 space-y-5 sm:space-y-6 md:space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
            Your Partner in <span className="text-brand-green">Resealable Innovation</span>
          </h2>

          <div className="text-brand-gray space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed">
            <p>
              ReLid USA brings a decade of European resealable technology leadership to the American market. We're not just a supplier — we're a strategic partner invested in your success from first sample to full-scale production.
            </p>
            <p>
              With U.S.-based manufacturing in Saint Charles, Illinois, we deliver the supply chain reliability American brands demand. Our production capacity is built for enterprise scale, with dedicated support teams ready to guide your integration.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 pt-2 sm:pt-4">
            <div className="pl-3 sm:pl-4 border-l-2 border-brand-green">
              <span className="block text-base sm:text-lg md:text-xl font-bold text-white mb-0.5 sm:mb-1">Proven Technology. Localized Production.</span>
              <span className="text-xs sm:text-sm text-brand-gray">European market validation meets American manufacturing infrastructure.</span>
            </div>
            <div className="pl-3 sm:pl-4 border-l-2 border-brand-green">
              <span className="block text-base sm:text-lg md:text-xl font-bold text-white mb-0.5 sm:mb-1">Built for Enterprise Scale</span>
              <span className="text-xs sm:text-sm text-brand-gray">Production infrastructure designed for emerging brands and major CPG players alike.</span>
            </div>
            <div className="pl-3 sm:pl-4 border-l-2 border-brand-green">
              <span className="block text-base sm:text-lg md:text-xl font-bold text-white mb-0.5 sm:mb-1">White-Glove Integration Support</span>
              <span className="text-xs sm:text-sm text-brand-gray">From initial samples to production rollout, hands-on technical support included.</span>
            </div>
          </div>

          <p className="text-white font-bold text-base sm:text-lg pt-2 sm:pt-4">"More than a product. A competitive advantage."</p>
        </div>
      </div>
    </Section>
  );
};

export default About;
