-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'ministry', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all roles if they are ministry"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'ministry') OR public.has_role(auth.uid(), 'admin'));

-- Create comments table for popular reports
CREATE TABLE public.report_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on comments
ALTER TABLE public.report_comments ENABLE ROW LEVEL SECURITY;

-- Comments RLS policies
CREATE POLICY "Anyone can view comments on reports"
  ON public.report_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add comments"
  ON public.report_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.report_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.report_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at on comments
CREATE TRIGGER update_report_comments_updated_at
  BEFORE UPDATE ON public.report_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update reports RLS policies to allow ministry users to view all reports
CREATE POLICY "Ministry users can view all reports"
  ON public.reports
  FOR SELECT
  USING (public.has_role(auth.uid(), 'ministry') OR public.has_role(auth.uid(), 'admin'));

-- Update reports RLS to allow ministry to update status
CREATE POLICY "Ministry users can update report status"
  ON public.reports
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'ministry') OR public.has_role(auth.uid(), 'admin'));

-- Assign default user role to existing users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'::app_role
FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;

-- Create trigger to auto-assign 'user' role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();