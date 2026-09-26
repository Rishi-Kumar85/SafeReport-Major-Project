-- Fix security warning by setting search_path for handle_new_report function
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