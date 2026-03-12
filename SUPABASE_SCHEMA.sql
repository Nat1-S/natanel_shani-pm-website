-- About (single row)
create table if not exists public.about (
  id text primary key default 'content',
  content jsonb not null default '{}'
);

-- Case Studies (documents = array of {url, type} for multiple files per study)
create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  use_case text not null default '',
  document_url text not null default '',
  document_type text not null default 'pdf',
  documents jsonb not null default '[]',
  "order" int not null default 0,
  created_at timestamptz default now()
);

-- Labs
create table if not exists public.labs (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  github_url text default '',
  live_url text default '',
  media jsonb default '[]',
  tags text[] default '{}',
  "order" int not null default 0,
  created_at timestamptz default now()
);

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  description text not null default '',
  tags text[] default '{}',
  thumbnail_url text default '',
  problem text default '',
  solution text default '',
  impact text default '',
  video_url text default '',
  prd_url text default '',
  strategy_url text default '',
  live_link text default '',
  "order" int not null default 0,
  featured boolean default false,
  created_at timestamptz default now()
);

-- RLS: allow public read, authenticated write
alter table public.about enable row level security;
alter table public.case_studies enable row level security;
alter table public.labs enable row level security;
alter table public.projects enable row level security;

create policy "about_select" on public.about for select using (true);
create policy "about_upsert" on public.about for all using (auth.role() = 'authenticated');

create policy "case_studies_select" on public.case_studies for select using (true);
create policy "case_studies_insert" on public.case_studies for insert with check (auth.role() = 'authenticated');
create policy "case_studies_update" on public.case_studies for update using (auth.role() = 'authenticated');
create policy "case_studies_delete" on public.case_studies for delete using (auth.role() = 'authenticated');

create policy "labs_select" on public.labs for select using (true);
create policy "labs_insert" on public.labs for insert with check (auth.role() = 'authenticated');
create policy "labs_update" on public.labs for update using (auth.role() = 'authenticated');
create policy "labs_delete" on public.labs for delete using (auth.role() = 'authenticated');

create policy "projects_select" on public.projects for select using (true);
create policy "projects_insert" on public.projects for insert with check (auth.role() = 'authenticated');
create policy "projects_update" on public.projects for update using (auth.role() = 'authenticated');
create policy "projects_delete" on public.projects for delete using (auth.role() = 'authenticated');

-- Storage policies for portfolio-assets bucket
-- Run AFTER creating the bucket in Storage
create policy "portfolio-assets insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio-assets');

create policy "portfolio-assets update" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio-assets');

create policy "portfolio-assets delete" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio-assets');

create policy "portfolio-assets public read" on storage.objects
  for select using (bucket_id = 'portfolio-assets');
