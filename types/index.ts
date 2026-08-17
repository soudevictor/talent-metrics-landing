export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
}

export interface Feature {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  avatarUrl?: string;
}

export interface SampleResume {
  id: string;
  label: string;
  description: string;
  content: string;
}

export interface CandidateHistoryItem {
  id: string;
  candidateName: string;
  jobTitle: string;
  score: number;
  analyzedAt: string;
  summary: string;
  matchingPoints: string[];
  improvementPoints: string[];
  matchPercentageByRole?: Record<string, number>;
}
