import React from 'react';

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, className = '', children }) => {
  return (
    <section id={id} className={`py-20 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default Section;