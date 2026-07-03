import { createClient, isSupabaseConfigured } from "./client";
import { mockLabs } from "@/data/mock-labs";
import { withTimeout } from "@/lib/timeout";
import type { LabProject } from "@/types/lab-project";

// Public reads go through the `labs_public` view (no internal columns such as
// created_at). Admin reads use the base table after authentication.
const LABS_PUBLIC_VIEW = "labs_public";
const LAB_PUBLIC_COLUMNS =
  'id,title,description,github_url,live_url,media,tags,"order"';

function mapLab(row: Record<string, unknown>): LabProject {
  return {
    id: row.id as string,
    title: (row.title as string) ?? "Untitled",
    description: (row.description as string) ?? "",
    githubUrl: (row.github_url as string) ?? "",
    liveUrl: (row.live_url as string) ?? "",
    media: (row.media as LabProject["media"]) ?? [],
    tags: (row.tags as string[]) ?? [],
    order: (row.order as number) ?? 0,
  };
}

export async function getLabs(): Promise<LabProject[]> {
  if (!isSupabaseConfigured) return mockLabs;
  const fetchPromise = (async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(LABS_PUBLIC_VIEW)
        .select(LAB_PUBLIC_COLUMNS)
        .order("order", { ascending: true });
      if (error || !data?.length) return mockLabs;
      return data.map(mapLab);
    } catch (e) {
      console.error(e);
      return mockLabs;
    }
  })();
  return withTimeout(fetchPromise, mockLabs);
}

/** Admin-only: full records straight from the base table (requires auth). */
export async function getLabsAdmin(): Promise<LabProject[]> {
  if (!isSupabaseConfigured) return mockLabs;
  const fetchPromise = (async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("labs")
        .select("*")
        .order("order", { ascending: true });
      if (error || !data?.length) return mockLabs;
      return data.map(mapLab);
    } catch (e) {
      console.error(e);
      return mockLabs;
    }
  })();
  return withTimeout(fetchPromise, mockLabs);
}

export async function addLab(data: Omit<LabProject, "id">): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createClient();
    const { data: row, error } = await supabase
      .from("labs")
      .insert({
        title: data.title,
        description: data.description,
        github_url: data.githubUrl,
        live_url: data.liveUrl,
        media: data.media ?? [],
        tags: data.tags ?? [],
        order: data.order,
      })
      .select("id")
      .single();
    return error ? null : (row?.id as string) ?? null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updateLab(id: string, data: Partial<LabProject>): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  await supabase.from("labs").update({
    ...(data.title != null && { title: data.title }),
    ...(data.description != null && { description: data.description }),
    ...(data.githubUrl != null && { github_url: data.githubUrl }),
    ...(data.liveUrl != null && { live_url: data.liveUrl }),
    ...(data.media != null && { media: data.media }),
    ...(data.tags != null && { tags: data.tags }),
    ...(data.order != null && { order: data.order }),
  }).eq("id", id);
}

export async function deleteLab(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  await supabase.from("labs").delete().eq("id", id);
}
