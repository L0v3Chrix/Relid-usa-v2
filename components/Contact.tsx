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
    alert('Thank you. We respond as quickly as possible — typically within one business day.');
  };

  return (
    <Section id="contact" className="bg-brand-black border-t border-white/10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-white mb-4">Let’s Talk About Your Next Packaging Advantage</h2>
          <p className="text-brand-gray text-lg">
            Whether you're launching a new product or upgrading an existing line, our team is here to support your transition to resealable aluminum technology.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-brand-black p-8 md:p-12 rounded-xl border border-white/10 shadow-2xl space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray uppercase tracking-wider" htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formState.name}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-white focus:border-brand-green focus:outline-none transition-colors placeholder-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-gray uppercase tracking-wider" htmlFor="company">Company</label>
              <input 
                type="text" 
                id="company" 
                name="company" 
                value={formState.company}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-white focus:border-brand-green focus:outline-none transition-colors placeholder-white/20"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-gray uppercase tracking-wider" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formState.email}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-white focus:border-brand-green focus:outline-none transition-colors placeholder-white/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-gray uppercase tracking-wider" htmlFor="message">Message</label>
            <textarea 
              id="message" 
              name="message" 
              rows={4} 
              value={formState.message}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-white focus:border-brand-green focus:outline-none transition-colors placeholder-white/20"
            ></textarea>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">Submit</Button>
          </div>
          
          <p className="text-center text-xs text-brand-gray mt-6">
             We respond as quickly as possible — typically within one business day.
          </p>
        </form>
      </div>
    </Section>
  );
};

export default Contact;