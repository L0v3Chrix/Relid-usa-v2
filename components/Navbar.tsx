import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Active section detection
      const sections = NAV_ITEMS.map(item => item.href.substring(1));
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust offset for sticky header
          if (rect.top >= -100 && rect.top <= 400) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brand-black/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center group">
          <img
            src="/images/relid-logo.png"
            alt="ReLid USA - Resealable Aluminum Can Technology"
            className="h-16 md:h-20 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm font-bold uppercase tracking-wide transition-colors hover:text-brand-green ${
                activeSection === item.href.substring(1) ? 'text-brand-green' : 'text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white hover:text-brand-green transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-brand-black border-t border-white/10 p-6 flex flex-col gap-4 shadow-2xl h-screen">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-xl font-heading font-bold py-3 border-b border-white/5 ${
                activeSection === item.href.substring(1) ? 'text-brand-green' : 'text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;