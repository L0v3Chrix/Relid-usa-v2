import { NavItem, Benefit, SizeSpec, DurabilityMetric } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Sizes', href: '#sizes' },
  { label: 'Technology', href: '#durability' },
  { label: 'Sustainability', href: '#sustainability' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const BENEFITS: Benefit[] = [
  { 
    category: 'Coffee', 
    text: 'Ideal for cold brew, nitro, and RTD coffee. Keeps aroma and freshness sealed between sips.', 
    iconName: 'Coffee' 
  },
  { 
    category: 'Energy', 
    text: 'Reseal and recharge on the go with zero spill risk.', 
    iconName: 'Zap' 
  },
  { 
    category: 'Water', 
    text: 'A sustainable alternative to plastic bottles with a clean, modern feel.', 
    iconName: 'Droplets' 
  },
  { 
    category: 'Alcoholic Beverages', 
    text: 'Preserve carbonation and freshness for longer, anywhere your customers go.', 
    iconName: 'Wine' 
  },
];

export const SIZES: SizeSpec[] = [
  { name: '202 Standard', description: 'Common across coffee, energy, and functional drinks.', width: 'w-24', height: 'h-40' },
  { name: '202 Sleek', description: 'Ideal for premium brands and lifestyle beverages.', width: 'w-20', height: 'h-48' },
  { name: '206 Standard', description: 'Larger opening, perfect for pour-friendly use.', width: 'w-28', height: 'h-40' },
  { name: 'Slim Can Options', description: 'Tailored for modern hydration, energy, and cocktail categories.', width: 'w-16', height: 'h-52' },
];

export const DURABILITY_DATA: DurabilityMetric[] = [
  { label: 'Reseal Strength', value: 98, fullMark: 100, unit: 'PSI' },
  { label: 'Thermal Stability', value: 95, fullMark: 100, unit: '°C' },
  { label: 'Impact Resistance', value: 90, fullMark: 100, unit: 'Drop' },
];

export const TALKING_POINTS = [
  { title: 'Freshness Retention', text: 'Maintains flavor and carbonation longer.' },
  { title: 'On‑the‑Go Convenience', text: 'Reseal between sips without worrying about spills.' },
  { title: 'Sustainability Impact', text: 'Supports aluminum recycling and reduces plastic waste.' },
  { title: 'Drop‑In Compatibility', text: 'Works with existing filling lines for seamless adoption.' },
  { title: 'Consumer Appeal', text: 'A modern upgrade that adds value instantly.' },
];