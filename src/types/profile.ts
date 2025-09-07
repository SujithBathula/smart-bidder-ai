export interface BidderProfile {
  id: string;
  user_id: string;
  full_name: string;
  company_name: string;
  registration_id: string;
  experience_years: number;
  industry: string;
  portfolio_links: string[];
  documents: Document[];
  verification_status: 'pending' | 'verified' | 'rejected';
  badge_level: 'bronze' | 'silver' | 'gold' | 'platinum' | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: 'certificate' | 'license' | 'portfolio' | 'other';
  uploaded_at: string;
}

export interface ProfileFormData {
  full_name: string;
  company_name: string;
  registration_id: string;
  experience_years: number;
  industry: string;
  portfolio_links: string[];
}