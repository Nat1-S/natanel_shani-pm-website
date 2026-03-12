"use client";

import { useState, useEffect, useRef } from "react";
import { getLabs, addLab, updateLab, deleteLab } from "@/lib/supabase/labs";
import { uploadFile } from "@/lib/supabase/upload";
import type { LabProject, LabMedia } from "@/types/lab-project";
import { Edit2, Trash2, Upload } from "lucide-react";

const ACCEPT = ".pdf,.doc,.docx,.pptx,.xls,.xlsx,.mp4,.webm,.mov,.avi,.mkv,.jpg,.jpeg,.png,.gif,.webp,.md";

function getMediaType(name: string): LabMedia["type"] {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext ?? "")) return "video";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? "")) return "image";
  return "document";
}

export function AdminLabs() {
  const [items, setItems] = useState<LabProject[]>([]);
  const [editing, setEditing] = useState<LabProject | null>(null);
  const [form, setForm] = useState({ title: "", description: "", githubUrl: "", liveUrl: "", tags: "", media: [] as LabMedia[] });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => getLabs().then(setItems);

  useEffect(() => {
    load();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadError("");
    setUploading(true);
    try {
      const newMedia: LabMedia[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const path = `labs/${Date.now()}-${i}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const url = await uploadFile(f, path);
        if (url) newMedia.push({ url, type: getMediaType(f.name), name: f.name });
      }
      if (newMedia.length > 0) setForm((p) => ({ ...p, media: [...p.media, ...newMedia] }));
      else setUploadError("Failed to upload. Check Storage rules and login.");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeMedia = (index: number) => {
    setForm((p) => ({ ...p, media: p.media.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = { ...form, tags, media: form.media };
    if (editing) {
      await updateLab(editing.id, { ...payload, order: editing.order });
      setEditing(null);
    } else {
      await addLab({ ...payload, order: items.length });
    }
    setForm({ title: "", description: "", githubUrl: "", liveUrl: "", tags: "", media: [] });
    setUploadError("");
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this lab?")) {
      await deleteLab(id);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl border border-[var(--card-border)]">
        <h3 className="font-semibold text-foreground">{editing ? "Edit" : "Add"} Lab Project</h3>
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-[var(--card-border)] text-foreground"
        />
        <textarea
          required
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-[var(--card-border)] text-foreground min-h-[80px]"
        />
        <input
          placeholder="GitHub URL"
          value={form.githubUrl}
          onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-[var(--card-border)] text-foreground"
        />
        <input
          placeholder="Live URL"
          value={form.liveUrl}
          onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-[var(--card-border)] text-foreground"
        />
        <div>
          <label className="block text-sm text-[var(--muted-foreground)] mb-2">Media (videos, images, PDF, PPTX, etc.)</label>
          <input ref={fileRef} type="file" accept={ACCEPT} multiple onChange={handleFileChange} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--card-border)] hover:border-[var(--accent)]/50 disabled:opacity-50">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : form.media.length ? "Add more files" : "Choose files"}
          </button>
          {form.media.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.media.map((m, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--accent-muted)] text-sm">
                  {m.name ?? m.url.slice(-20)}
                  <button type="button" onClick={() => removeMedia(i)} className="text-red-500 ml-1">×</button>
                </span>
              ))}
            </div>
          )}
          {uploadError && <p className="text-sm text-red-500 mt-2">{uploadError}</p>}
        </div>
        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-[var(--card-border)] text-foreground"
        />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium">
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ title: "", description: "", githubUrl: "", liveUrl: "", tags: "", media: [] }); setUploadError(""); }} className="px-4 py-2 rounded-lg border border-[var(--card-border)] text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--card-border)]">
            <div>
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-sm text-[var(--muted-foreground)] line-clamp-1">{item.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(item);
                  setForm({ title: item.title, description: item.description, githubUrl: item.githubUrl ?? "", liveUrl: item.liveUrl ?? "", tags: item.tags.join(", "), media: item.media ?? [] });
                }}
                className="p-2 rounded-lg hover:bg-white/10 text-[var(--muted-foreground)]"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
