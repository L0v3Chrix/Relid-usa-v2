import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductBenefits from './components/ProductBenefits';
import HowItWorks from './components/HowItWorks';
import Sizes from './components/Sizes';
import Durability from './components/Durability';
import TalkingPoints from './components/TalkingPoints';
import Sustainability from './components/Sustainability';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-sans antialiased text-white selection:bg-brand-green selection:text-brand-black">
      <Navbar />
      <main>
        <Hero />
        <ProductBenefits />
        <HowItWorks />
        <Sizes />
        <Durability />
        <TalkingPoints />
        <Sustainability />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;