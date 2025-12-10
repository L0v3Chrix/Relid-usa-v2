import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black py-16 border-t border-white/10 text-center text-sm text-brand-gray">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
         <div className="flex justify-center items-center mb-8">
            <a href="#hero" className="opacity-80 hover:opacity-100 transition-opacity">
               <img
                  src="/images/relid-logo.png"
                  alt="ReLid USA"
                  className="h-20 w-auto"
               />
            </a>
         </div>
         
         <div className="flex flex-wrap justify-center gap-8 font-bold uppercase tracking-wider text-xs">
           <a href="#sustainability" className="hover:text-brand-green transition-colors">Sustainability</a>
           <a href="#durability" className="hover:text-brand-green transition-colors">Technology</a>
           <a href="#contact" className="hover:text-brand-green transition-colors">Contact</a>
         </div>

         <div className="pt-8 opacity-40 font-light">
           <p className="mb-2">ReLid USA © 2025 • All Rights Reserved</p>
           <p>Saint Charles, IL, USA</p>
         </div>
      </div>
    </footer>
  );
};

export default Footer;