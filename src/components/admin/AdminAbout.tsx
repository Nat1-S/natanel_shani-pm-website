"use client";

import { useState, useEffect, useRef } from "react";
import { getAbout, setAbout } from "@/lib/supabase/about";
import { uploadFile } from "@/lib/supabase/upload";
import type { AboutContent } from "@/types/about";
import { Upload } from "lucide-react";

export function AdminAbout() {
  const [data, setData] = useState<AboutContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAbout().then(setData);
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    try {
      await setAbout(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <div className="text-[var(--muted-foreground)]">Loading…</div>;

  const aboutKeys = ["greeting", "intro", "journeyTitle", "journey", "educationTitle", "education", "reachOutTitle", "reachOut", "email", "linkedinUrl"] as const;

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !data) return;
    setCvUploading(true);
    try {
      const url = await uploadFile(f, `about/cv-${Date.now()}.${f.name.split(".").pop() || "pdf"}`);
      if (url) setData({ ...data, cvUrl: url });
    } finally {
      setCvUploading(false);
      if (cvInputRef.current) cvInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Hero (משפט + סקילים)</h3>
        <div className="space-y-4 pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-[var(--card-border)]">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">משפט (Hero Tagline)</label>
            <textarea
              rows={3}
              value={data.heroTagline ?? ""}
              onChange={(e) => setData({ ...data, heroTagline: e.target.value })}
              placeholder="From 10 years of IDF combat leadership..."
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-[var(--card-border)] text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">סקילים (מופרדים בפסיק)</label>
            <input
              type="text"
              value={(data.heroSkills ?? []).join(", ")}
              onChange={(e) =>
                setData({
                  ...data,
                  heroSkills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              placeholder="Product Lifecycle, AI-Driven, Data-Driven..."
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-[var(--card-border)] text-foreground"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">About</h3>
        <div className="space-y-4">
      {aboutKeys.map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium text-foreground mb-1 capitalize">
            {key === "cvUrl" ? "CV URL (קישור להורדת קורות חיים)" : key.replace(/([A-Z])/g, " $1").trim()}
          </label>
          <input
            type="text"
            value={data[key as keyof AboutContent]}
            onChange={(e) => setData({ ...data, [key]: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-[var(--card-border)] text-foreground"
          />
        </div>
      ))}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">CV (קורות חיים)</label>
            <div className="flex gap-2 flex-wrap">
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => cvInputRef.current?.click()}
                disabled={cvUploading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-[var(--card-border)] text-sm disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {cvUploading ? "מעלה…" : "העלה קובץ"}
              </button>
              <input
                type="text"
                value={data.cvUrl ?? ""}
                onChange={(e) => setData({ ...data, cvUrl: e.target.value })}
                placeholder="או הדבק קישור ל-PDF"
                className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-white/5 border border-[var(--card-border)] text-foreground text-sm"
              />
            </div>
            {data.cvUrl && <p className="text-xs text-[var(--accent)] mt-1">✓ קובץ CV מקושר</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded-xl bg-[var(--accent)] text-white font-medium disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-[var(--accent)]">Saved!</span>}
      </div>
    </div>
  );
}
