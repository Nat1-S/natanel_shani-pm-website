-- Add documents column for multiple files per case study
-- Run this in Supabase SQL Editor after the main schema

alter table public.case_studies
  add column if not exists documents jsonb not null default '[]';

-- Migrate existing document_url to documents (one-time)
update public.case_studies
set documents = jsonb_build_array(
  jsonb_build_object('url', document_url, 'type', coalesce(document_type, 'pdf'))
)
where documents = '[]'::jsonb and document_url is not null and document_url != '';
