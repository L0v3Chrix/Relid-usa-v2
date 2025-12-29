import { NavItem, Benefit, SizeSpec, DurabilityMetric } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Sizes', href: '#sizes' },
  { label: 'Technology', href: '#durability' },
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
  { title: 'Premium Positioning', text: 'Resealable technology justifies premium shelf placement and pricing. Give consumers a tangible reason to choose — and pay more for — your brand.' },
  { title: 'Zero Line Modifications', text: 'ReLid integrates with your existing filling equipment. No capital expenditure. No production downtime. No extended timelines.' },
  { title: 'Consumer-Driven Demand', text: 'Consumers actively seek resealable options. Give them what they want — before your competitors do.' },
  { title: 'Sustainability Story', text: '100% aluminum means infinite recyclability. Eliminate plastic closures and shrink bands to reduce single-use plastic waste.' },
  { title: 'Brand Differentiation', text: 'In a sea of identical cans, resealability is an immediate visual and functional differentiator. The product consumers remember — and repurchase.' },
];