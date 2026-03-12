import { createClient, isSupabaseConfigured } from "./client";
import { mockLabs } from "@/data/mock-labs";
import { withTimeout } from "@/lib/timeout";
import type { LabProject } from "@/types/lab-project";

export async function getLabs(): Promise<LabProject[]> {
  if (!isSupabaseConfigured) return mockLabs;
  const fetchPromise = (async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("labs")
        .select("*")
        .order("order", { ascending: true });
      if (error || !data?.length) return mockLabs;
      return data.map((row: Record<string, unknown>) => ({
        id: row.id,
        title: row.title ?? "Untitled",
        description: row.description ?? "",
        githubUrl: row.github_url ?? "",
        liveUrl: row.live_url ?? "",
        media: row.media ?? [],
        tags: row.tags ?? [],
        order: row.order ?? 0,
      })) as LabProject[];
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
