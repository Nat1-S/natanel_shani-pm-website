"use client";

import { useState, useEffect, useRef } from "react";
import { getCaseStudies, addCaseStudy, updateCaseStudy, deleteCaseStudy } from "@/lib/supabase/case-studies";
import { uploadFile } from "@/lib/supabase/upload";
import type { CaseStudy, CaseStudyDocument } from "@/types/case-study";
import { Trash2, Edit2, Upload } from "lucide-react";

const ACCEPT =
  ".pdf,.doc,.docx,.pptx,.xls,.xlsx,.mp4,.webm,.mov,.avi,.mkv,.jpg,.jpeg,.png,.gif,.webp,.md";
const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.gif,.webp";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(id: string) {
  return UUID_REGEX.test(id);
}

function getDocType(name: string): CaseStudyDocument["type"] {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext ?? "")) return "video";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? "")) return "image";
  if (ext === "md") return "md";
  if (ext === "pdf") return "pdf";
  if (["docx", "doc"].includes(ext ?? "")) return ext as "docx" | "doc";
  if (ext === "pptx") return "pptx";
  if (["xls", "xlsx"].includes(ext ?? "")) return ext as "xls" | "xlsx";
  return "pdf";
}

export function AdminCaseStudies() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    useCase: string;
    documents: CaseStudyDocument[];
    imageUrl: string;
  }>({ title: "", description: "", useCase: "", documents: [], imageUrl: "" });
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const load = () => getCaseStudies().then(setItems);

  useEffect(() => {
    load();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadError("");
    setUploading(true);
    try {
      const uploaded: CaseStudyDocument[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const url = await uploadFile(f, `case-studies/${Date.now()}-${i}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`);
        if (url) uploaded.push({ url, type: getDocType(f.name) });
      }
      if (uploaded.length > 0) {
        setForm((p) => ({ ...p, documents: [...p.documents, ...uploaded] }));
      } else if (files.length > 0) {
        setUploadError("Failed to upload. Check that you're logged in and the portfolio-assets bucket exists.");
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeDocument = (idx: number) => {
    setForm((p) => ({ ...p, documents: p.documents.filter((_, i) => i !== idx) }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageUploading(true);
    try {
      const url = await uploadFile(f, `case-studies/images/${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`);
      if (url) setForm((p) => ({ ...p, imageUrl: url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setImageUploading(false);
      if (imageRef.current) imageRef.current.value = "";
    }
  };

  const removeImage = () => setForm((p) => ({ ...p, imageUrl: "" }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    try {
      if (editing) {
        if (isUuid(editing.id)) {
          await updateCaseStudy(editing.id, { ...form, imageUrl: form.imageUrl || undefined, order: editing.order });
        } else {
          await addCaseStudy({ ...form, imageUrl: form.imageUrl || undefined, order: items.length });
        }
        setEditing(null);
      } else {
        await addCaseStudy({ ...form, order: items.length });
      }
      setForm({ title: "", description: "", useCase: "", documents: [], imageUrl: "" });
      setUploadError("");
      load();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "שגיאה בשמירה");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this case study?")) return;
    if (!isUuid(id)) {
      setItems((prev) => prev.filter((x) => x.id !== id));
      return;
    }
    await deleteCaseStudy(id);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl border border-[var(--card-border)]">
        <h3 className="font-semibold text-foreground">{editing ? "Edit" : "Add"} Case Study</h3>
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
        <div>
          <textarea
            placeholder="Use Case"
            value={form.useCase}
            onChange={(e) => setForm((p) => ({ ...p, useCase: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-[var(--card-border)] text-foreground min-h-[120px]"
          />
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Markdown: **טקסט** למודגש, Enter לשורה חדשה
          </p>
        </div>
        <div>
          <label className="block text-sm text-[var(--muted-foreground)] mb-2">
            תמונת פרופיל לפרויקט (אופציונלי)
          </label>
          <input
            ref={imageRef}
            type="file"
            accept={IMAGE_ACCEPT}
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex gap-2 flex-wrap items-center">
            <button
              type="button"
              onClick={() => imageRef.current?.click()}
              disabled={imageUploading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--card-border)] hover:border-[var(--accent)]/50 transition-colors disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {imageUploading ? "מעלה…" : form.imageUrl ? "החלף תמונה" : "העלה תמונה"}
            </button>
            {form.imageUrl && (
              <>
                <img src={form.imageUrl} alt="" className="h-12 w-auto rounded object-cover" />
                <button type="button" onClick={removeImage} className="text-red-400 hover:text-red-300 text-sm">
                  הסר תמונה
                </button>
              </>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm text-[var(--muted-foreground)] mb-2">
            מסמכים (PDF, DOC/DOCX, PPTX, XLS/XLSX, סרטון, תמונות, MD) – ניתן לבחור כמה קבצים
          </label>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--card-border)] hover:border-[var(--accent)]/50 transition-colors disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "מעלה…" : "בחר קבצים"}
          </button>
          {form.documents.length > 0 && (
            <div className="mt-2 space-y-1">
              {form.documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm py-1 px-2 rounded bg-white/5"
                >
                  <span className="text-[var(--accent)] truncate flex-1">
                    ✓ {doc.type.toUpperCase()} #{i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDocument(i)}
                    className="text-red-400 hover:text-red-300 ml-2"
                    title="הסר"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {uploadError && (
            <p className="text-sm text-red-500 mt-2">{uploadError}</p>
          )}
          {submitError && (
            <p className="text-sm text-red-500 mt-2">{submitError}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium"
          >
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ title: "", description: "", useCase: "", documents: [], imageUrl: "" });
                setUploadError("");
              }}
              className="px-4 py-2 rounded-lg border border-[var(--card-border)] text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {items.map((cs) => (
          <div key={cs.id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--card-border)]">
            <div>
              <p className="font-medium text-foreground">{cs.title}</p>
              <p className="text-sm text-[var(--muted-foreground)] line-clamp-1">{cs.description}</p>
              <div className="flex gap-2 text-xs mt-1">
                {cs.imageUrl && <span className="text-[var(--accent)]">✓ תמונה</span>}
                {(cs.documents?.length ?? 0) > 0 ? (
                  <span className="text-[var(--accent)]">✓ {(cs.documents?.length ?? 0)} קבצים</span>
                ) : (
                  <span className="text-[var(--muted-foreground)]/70">ללא קבצים</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(cs);
                  setForm({
                    title: cs.title,
                    description: cs.description,
                    useCase: cs.useCase,
                    documents: [...(cs.documents ?? [])],
                    imageUrl: cs.imageUrl ?? "",
                  });
                  setUploadError("");
                }}
                className="p-2 rounded-lg hover:bg-white/10 text-[var(--muted-foreground)]"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(cs.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
