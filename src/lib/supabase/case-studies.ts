import { createClient, isSupabaseConfigured } from "./client";
import { mockCaseStudies } from "@/data/mock-case-studies";
import { withTimeout } from "@/lib/timeout";
import type { CaseStudy, CaseStudyDocument } from "@/types/case-study";

function normalizeDocuments(row: {
  documents?: unknown;
  document_url?: string | null;
  document_type?: string | null;
}): CaseStudyDocument[] {
  const docs = row.documents;
  if (Array.isArray(docs) && docs.length > 0) {
    return docs
      .filter((d): d is { url?: string; type?: string } => d != null && typeof d === "object")
      .map((d) => ({
        url: typeof d.url === "string" ? d.url : "",
        type: (typeof d.type === "string" ? d.type : "pdf") as CaseStudyDocument["type"],
      }))
      .filter((d) => d.url);
  }
  const url = row.document_url ?? "";
  if (url) {
    return [{ url, type: (row.document_type ?? "pdf") as CaseStudyDocument["type"] }];
  }
  return [];
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  if (!isSupabaseConfigured) return mockCaseStudies;
  const fetchPromise = (async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .order("order", { ascending: true });
      if (error || !data?.length) return mockCaseStudies;
      return data.map((row) => ({
        id: row.id,
        title: row.title ?? "Untitled",
        description: row.description ?? "",
        useCase: row.use_case ?? "",
        documents: normalizeDocuments(row),
        order: row.order ?? 0,
      })) as CaseStudy[];
    } catch (e) {
      console.error(e);
      return mockCaseStudies;
    }
  })();
  return withTimeout(fetchPromise, mockCaseStudies);
}

export async function addCaseStudy(data: Omit<CaseStudy, "id">): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("case_studies")
    .insert({
      title: data.title,
      description: data.description,
      use_case: data.useCase,
      documents: data.documents ?? [],
      order: data.order,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return row?.id ?? null;
}

export async function updateCaseStudy(id: string, data: Partial<CaseStudy>): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  const { error } = await supabase.from("case_studies").update({
    ...(data.title != null && { title: data.title }),
    ...(data.description != null && { description: data.description }),
    ...(data.useCase != null && { use_case: data.useCase }),
    ...(data.documents != null && { documents: data.documents }),
    ...(data.order != null && { order: data.order }),
  }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCaseStudy(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  await supabase.from("case_studies").delete().eq("id", id);
}
