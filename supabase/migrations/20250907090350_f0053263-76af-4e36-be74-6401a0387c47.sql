-- Create enum types
CREATE TYPE public.bidder_type AS ENUM ('individual', 'freelancer', 'company', 'govt_agency');
CREATE TYPE public.proposal_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE public.payment_type AS ENUM ('submission_fee', 'subscription_monthly', 'subscription_yearly');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  registration_id TEXT,
  years_experience INTEGER DEFAULT 0,
  primary_industry TEXT,
  portfolio_links TEXT[] DEFAULT '{}',
  bidder_type bidder_type DEFAULT 'individual',
  verification_status verification_status DEFAULT 'unverified',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tenders table
CREATE TABLE public.tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget DECIMAL(15,2) NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  requirements TEXT,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  embedding VECTOR(1536), -- For AI recommendations
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create proposals table
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE NOT NULL,
  proposal_text TEXT NOT NULL,
  ai_confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  status proposal_status DEFAULT 'pending',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(proposer_id, tender_id) -- One proposal per user per tender
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_type payment_type NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  payment_status payment_status DEFAULT 'pending',
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create documents table for file uploads
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  document_type TEXT, -- 'portfolio', 'proposal_attachment', 'verification'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Tenders policies
CREATE POLICY "Anyone can view tenders" ON public.tenders
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tenders" ON public.tenders
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own tenders" ON public.tenders
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own tenders" ON public.tenders
  FOR DELETE USING (auth.uid() = creator_id);

-- Proposals policies
CREATE POLICY "Users can view their own proposals" ON public.proposals
  FOR SELECT USING (auth.uid() = proposer_id);

CREATE POLICY "Tender creators can view proposals for their tenders" ON public.proposals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tenders 
      WHERE id = tender_id AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can create proposals for open tenders" ON public.proposals
  FOR INSERT WITH CHECK (auth.uid() = proposer_id);

CREATE POLICY "Users can update their own pending proposals" ON public.proposals
  FOR UPDATE USING (auth.uid() = proposer_id AND status = 'pending');

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view their own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_tenders_category ON public.tenders(category);
CREATE INDEX idx_tenders_deadline ON public.tenders(deadline);
CREATE INDEX idx_tenders_budget ON public.tenders(budget);
CREATE INDEX idx_tenders_creator ON public.tenders(creator_id);
CREATE INDEX idx_proposals_tender ON public.proposals(tender_id);
CREATE INDEX idx_proposals_proposer ON public.proposals(proposer_id);
CREATE INDEX idx_proposals_status ON public.proposals(status);
CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(payment_status);
CREATE INDEX idx_documents_user ON public.documents(user_id);

-- Create function to automatically update updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenders_updated_at
  BEFORE UPDATE ON public.tenders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();