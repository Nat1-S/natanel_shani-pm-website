"use client";

import { useState, useEffect, useRef } from "react";
import { getAbout, setAbout, DEFAULT_PROFILE_IMAGE } from "@/lib/supabase/about";
import { uploadFile } from "@/lib/supabase/upload";
import type { AboutContent } from "@/types/about";
import { Upload, RotateCcw } from "lucide-react";

const PROFILE_IMAGE_ACCEPT = ".jpg,.jpeg,.png,.gif,.webp";

export function AdminAbout() {
  const [data, setData] = useState<AboutContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const cvInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

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
  const profileSrc = data.profileImageUrl || DEFAULT_PROFILE_IMAGE;

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

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !data) return;
    setUploadError("");
    setProfileUploading(true);
    try {
      const ext = f.name.split(".").pop()?.toLowerCase() || "png";
      const url = await uploadFile(f, `about/profile-${Date.now()}.${ext}`);
      if (url) setData({ ...data, profileImageUrl: url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "העלאה נכשלה");
    } finally {
      setProfileUploading(false);
      if (profileInputRef.current) profileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Hero (תמונה + משפט + סקילים)</h3>
        <div className="space-y-4 pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-[var(--card-border)]">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">תמונת פרופיל (Hero)</label>
            <div className="flex flex-wrap items-start gap-4">
              <img
                src={profileSrc}
                alt="Profile preview"
                className="h-28 w-28 rounded-full object-cover object-[50%_20%] border-2 border-[var(--accent)]/30"
              />
              <div className="flex-1 min-w-[200px] space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept={PROFILE_IMAGE_ACCEPT}
                    onChange={handleProfileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => profileInputRef.current?.click()}
                    disabled={profileUploading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-[var(--card-border)] text-sm disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {profileUploading ? "מעלה…" : "העלה תמונה"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, profileImageUrl: DEFAULT_PROFILE_IMAGE })}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-[var(--card-border)] text-sm"
                  >
                    <RotateCcw className="h-4 w-4" />
                    ברירת מחדל
                  </button>
                </div>
                <input
                  type="text"
                  value={data.profileImageUrl ?? ""}
                  onChange={(e) => setData({ ...data, profileImageUrl: e.target.value })}
                  placeholder="או הדבק קישור לתמונה"
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-[var(--card-border)] text-foreground text-sm"
                />
                {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                <p className="text-xs text-[var(--muted-foreground)]">JPG, PNG, GIF או WebP. לחץ Save אחרי ההעלאה.</p>
              </div>
            </div>
          </div>
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
            {key.replace(/([A-Z])/g, " $1").trim()}
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

