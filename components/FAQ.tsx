import React, { useState } from 'react';
import Section from './ui/Section';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Does ReLid require modifications to our existing filling line?",
      answer: "No. ReLid is designed for drop-in compatibility with standard filling equipment. Our technology integrates with your existing production line without capital expenditure, production downtime, or extended timelines. Our team provides hands-on integration support from first sample to full production."
    },
    {
      question: "What can sizes does ReLid support?",
      answer: "ReLid currently supports 202 and 206 Diameter in sizes: B64, CDL+, CDLE, and ISE can end formats. Additional sizes are in development."
    },
    {
      question: "How does the resealable mechanism work?",
      answer: "The patented ReLid sliding mechanism operates in four simple steps: Start closed, lift the tab end, slide back to drink, and slide forward to reseal. It's intuitive for first-time users and durable enough for mobile consumers."
    },
    {
      question: "Is ReLid fully recyclable?",
      answer: "Yes. The entire ReLid mechanism is 100% aluminum — no mixed materials, no plastic components. This means it's infinitely recyclable through standard aluminum recycling streams."
    },
    {
      question: "What beverage categories work with ReLid?",
      answer: "ReLid works across all major beverage categories including water and functional drinks, RTD coffee, energy and performance beverages, and wine and spirits. Any brand looking for premium positioning through resealable packaging can benefit from ReLid technology."
    },
    {
      question: "What's the process to get started with ReLid?",
      answer: "Getting started is simple: Submit an inquiry through our contact form, and our team will reach out within 24 hours for an initial consultation. We'll ship product samples for your evaluation, conduct a technical integration assessment, and provide a custom production timeline and proposal tailored to your needs."
    },
    {
      question: "Does ReLid help with premium pricing and brand differentiation?",
      answer: "Absolutely. Resealable technology justifies premium shelf placement and pricing by giving consumers a tangible reason to choose your brand. In a market of identical cans, resealability is an immediate visual and functional differentiator — creating the brand recognition that drives repurchase."
    },
    {
      question: "What support does ReLid USA provide during integration?",
      answer: "ReLid USA provides white-glove integration support throughout your journey. From initial samples to production rollout, our dedicated technical team guides your integration. We're not just a supplier — we're a strategic partner invested in your success from first conversation to full-scale production."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" className="bg-brand-black border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3 sm:mb-4 text-white">
            Frequently Asked <span className="text-brand-green">Questions</span>
          </h2>
          <p className="text-brand-gray text-base sm:text-lg">
            Everything you need to know about ReLid technology and partnership.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-lg sm:rounded-xl overflow-hidden bg-white/5 hover:border-brand-green/30 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left"
              >
                <span className="text-sm sm:text-base md:text-lg font-bold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-brand-green shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 text-sm sm:text-base text-brand-gray leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default FAQ;
