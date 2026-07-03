-- ============================================================================
-- Public-safe read layer for anonymous users
-- ----------------------------------------------------------------------------
-- WHAT THIS DOES
--   1. Creates curated "public" VIEWS that expose ONLY the columns rendered in
--      the public website UI.
--   2. Removes the blanket SELECT grant for the anonymous (`anon`) role on the
--      base tables and re-grants SELECT on the public columns only
--      (column-level least privilege / defense in depth).
--   3. Leaves the authenticated (admin) role with full access to the base
--      tables, so Admin mode keeps working after login.
--
-- SAFETY
--   * Non-destructive: no data is deleted, no columns/tables are dropped.
--   * No schema (table) changes.
--   * Fully reversible (see the ROLLBACK block at the bottom).
--
-- HOW TO APPLY
--   Supabase Dashboard -> SQL Editor -> paste this whole file -> Run.
--   (Requires Postgres 15+, which every current Supabase project uses.)
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1) PROJECTS
--    Public UI (BentoGrid + project one-pager) renders every field below.
--    Excluded from anon: thumbnail_url, featured, created_at.
-- ----------------------------------------------------------------------------
create or replace view public.projects_public
with (security_invoker = on) as
select
  id, slug, title, description, tags,
  problem, solution, impact,
  video_url, prd_url, strategy_url, live_link,
  "order"
from public.projects;

revoke select on public.projects from anon;
grant select (
  id, slug, title, description, tags,
  problem, solution, impact,
  video_url, prd_url, strategy_url, live_link, "order"
) on public.projects to anon;

grant select on public.projects_public to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 2) CASE STUDIES
--    Public UI (cards + document viewer) renders every field below.
--    document_url / document_type are legacy single-file columns still used as
--    a fallback by the viewer, so they stay public. Excluded: created_at.
-- ----------------------------------------------------------------------------
create or replace view public.case_studies_public
with (security_invoker = on) as
select
  id, title, description, use_case,
  documents, document_url, document_type,
  image_url, "order"
from public.case_studies;

revoke select on public.case_studies from anon;
grant select (
  id, title, description, use_case,
  documents, document_url, document_type,
  image_url, "order"
) on public.case_studies to anon;

grant select on public.case_studies_public to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 3) LABS
--    Public UI (cards + lab modal) renders every field below.
--    github_url / live_url are shown as "GitHub" / "Live Site" buttons, so they
--    remain public by design. Excluded from anon: created_at.
-- ----------------------------------------------------------------------------
create or replace view public.labs_public
with (security_invoker = on) as
select
  id, title, description,
  github_url, live_url, media, tags,
  "order"
from public.labs;

revoke select on public.labs from anon;
grant select (
  id, title, description,
  github_url, live_url, media, tags, "order"
) on public.labs to anon;

grant select on public.labs_public to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 4) ABOUT
--    Single-row jsonb `content` (bio, email, LinkedIn, CV link) is entirely
--    public content, so no change is required. Left as-is on purpose.
-- ----------------------------------------------------------------------------

commit;

-- Reload the PostgREST schema cache so the new views are exposed immediately.
notify pgrst, 'reload schema';


-- ============================================================================
-- ROLLBACK (run only if you need to undo the change)
-- ============================================================================
-- begin;
--   drop view if exists public.projects_public;
--   drop view if exists public.case_studies_public;
--   drop view if exists public.labs_public;
--   grant select on public.projects     to anon;
--   grant select on public.case_studies to anon;
--   grant select on public.labs         to anon;
-- commit;
-- notify pgrst, 'reload schema';
