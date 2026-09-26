-- Create the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create enum for report status
CREATE TYPE public.report_status AS ENUM ('submitted', 'under_review', 'investigating', 'resolved', 'closed');

-- Create enum for report category
CREATE TYPE public.report_category AS ENUM ('financial_fraud', 'bribery', 'misuse_of_power', 'conflict_of_interest', 'nepotism', 'other');

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category report_category NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  incident_date DATE NOT NULL,
  description TEXT NOT NULL,
  status report_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create report timeline table
CREATE TABLE public.report_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  status report_status NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reports
-- Anyone can insert reports (anonymous reporting)
CREATE POLICY "Anyone can submit reports"
ON public.reports
FOR INSERT
WITH CHECK (true);

-- Users can view their own reports
CREATE POLICY "Users can view their own reports"
ON public.reports
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow tracking by tracking_id (public access for anonymous reports)
CREATE POLICY "Anyone can view reports by tracking_id"
ON public.reports
FOR SELECT
USING (true);

-- RLS Policies for timeline
-- Anyone can view timeline for reports they can access
CREATE POLICY "Anyone can view timeline"
ON public.report_timeline
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.reports
    WHERE reports.id = report_timeline.report_id
  )
);

-- Create function to auto-create initial timeline entry
CREATE OR REPLACE FUNCTION public.handle_new_report()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.report_timeline (report_id, status, title, description)
  VALUES (
    NEW.id,
    'submitted',
    'Report Submitted',
    'Your report has been successfully submitted and assigned a tracking ID. Our team will review it shortly.'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new reports
CREATE TRIGGER on_report_created
  AFTER INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_report();

-- Create updated_at trigger
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();