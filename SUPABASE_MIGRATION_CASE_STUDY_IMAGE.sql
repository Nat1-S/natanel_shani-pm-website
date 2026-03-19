-- Add image_url for case study card thumbnail
alter table public.case_studies
  add column if not exists image_url text default '';
