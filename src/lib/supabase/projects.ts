import { createClient, isSupabaseConfigured } from "./client";
import { mockProjects } from "@/data/mock-projects";
import type { Project } from "@/types/project";

// Public-safe projection. Anonymous users read through the `projects_public`
// view, which only exposes fields rendered in the public UI. Internal columns
// (thumbnail_url, featured, created_at) are intentionally excluded.
const PROJECTS_PUBLIC_VIEW = "projects_public";
const PROJECT_PUBLIC_COLUMNS =
  'id,slug,title,description,tags,problem,solution,impact,video_url,prd_url,strategy_url,live_link,"order"';

function mapRow(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    slug: (row.slug as string) ?? (row.id as string),
    title: (row.title as string) ?? "Untitled Project",
    description: (row.description as string) ?? "",
    tags: (row.tags as string[]) ?? [],
    thumbnailUrl: (row.thumbnail_url as string) ?? "",
    problem: (row.problem as string) ?? "",
    solution: (row.solution as string) ?? "",
    impact: (row.impact as string) ?? "",
    videoUrl: (row.video_url as string) ?? "",
    prdUrl: (row.prd_url as string) ?? "",
    strategyUrl: (row.strategy_url as string) ?? "",
    liveLink: (row.live_link as string) ?? "",
    order: (row.order as number) ?? 0,
    featured: (row.featured as boolean) ?? false,
  };
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return mockProjects;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from(PROJECTS_PUBLIC_VIEW)
      .select(PROJECT_PUBLIC_COLUMNS)
      .order("order", { ascending: true });
    if (error || !data?.length) return mockProjects;
    return data.map(mapRow);
  } catch (e) {
    console.error(e);
    return mockProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured) return mockProjects.find((p) => p.slug === slug) ?? null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from(PROJECTS_PUBLIC_VIEW)
      .select(PROJECT_PUBLIC_COLUMNS)
      .eq("slug", slug)
      .single();
    if (error || !data) return mockProjects.find((p) => p.slug === slug) ?? null;
    return mapRow(data);
  } catch (e) {
    console.error(e);
    return mockProjects.find((p) => p.slug === slug) ?? null;
  }
}
