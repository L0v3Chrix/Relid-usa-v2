import React, { useState } from 'react';
import Section from './ui/Section';
import Button from './ui/Button';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    company: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you. Our team will reach out within 24 hours to schedule your consultation.');
  };

  return (
    <Section id="contact" className="bg-brand-black border-t border-white/10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-3 sm:mb-4">
            Start Your <span className="text-brand-green">Competitive Advantage</span> Today
          </h2>
          <p className="text-brand-gray text-base sm:text-lg">
            Whether you're launching a new product line or upgrading existing SKUs, our team is ready to guide you from first conversation to full production.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Here's What to Expect:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-brand-green font-bold shrink-0">1.</span>
              <span className="text-brand-gray">Initial consultation call within 24 hours</span>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-brand-green font-bold shrink-0">2.</span>
              <span className="text-brand-gray">Product samples shipped for evaluation</span>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-brand-green font-bold shrink-0">3.</span>
              <span className="text-brand-gray">Technical integration assessment</span>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-brand-green font-bold shrink-0">4.</span>
              <span className="text-brand-gray">Custom production timeline and proposal</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-brand-black p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl border border-white/10 shadow-2xl space-y-4 sm:space-y-6">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-bold text-brand-gray uppercase tracking-wider" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-none p-3 sm:p-4 text-white text-sm sm:text-base focus:border-brand-green focus:outline-none transition-colors placeholder-white/20"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-bold text-brand-gray uppercase tracking-wider" htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formState.company}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-none p-3 sm:p-4 text-white text-sm sm:text-base focus:border-brand-green focus:outline-none transition-colors placeholder-white/20"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-bold text-brand-gray uppercase tracking-wider" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-none p-3 sm:p-4 text-white text-sm sm:text-base focus:border-brand-green focus:outline-none transition-colors placeholder-white/20"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-bold text-brand-gray uppercase tracking-wider" htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formState.message}
              onChange={handleChange}
              required
              placeholder="Tell us about your project, volume requirements, and timeline..."
              className="w-full bg-white/5 border border-white/10 rounded-none p-3 sm:p-4 text-white text-sm sm:text-base focus:border-brand-green focus:outline-none transition-colors placeholder-white/30"
            ></textarea>
          </div>

          <div className="pt-2 sm:pt-4">
            <Button type="submit" className="w-full">Request Your Samples</Button>
          </div>

          <p className="text-center text-xs sm:text-sm text-brand-gray mt-4 sm:mt-6">
            Our team responds within one business day.
          </p>
        </form>
      </div>
    </Section>
  );
};

export default Contact;
