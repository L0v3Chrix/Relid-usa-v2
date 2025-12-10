export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  iconName: string;
}

export interface SizeSpec {
  name: string;
  description: string;
  width: string; // CSS width class representation
  height: string; // CSS height class representation
}

export interface Benefit {
  category: string;
  text: string;
  iconName: string;
}

export interface DurabilityMetric {
  label: string;
  value: number;
  fullMark: number;
  unit: string;
}