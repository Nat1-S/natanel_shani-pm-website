"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Download } from "lucide-react";
import type { LabProject, LabMedia } from "@/types/lab-project";

function getDocViewerUrl(url: string): string {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
}

function MediaItem({ m }: { m: LabMedia }) {
  if (m.type === "video") {
    return (
      <div className="rounded-xl overflow-hidden border border-[var(--card-border)] bg-zinc-900/50">
        <video src={m.url} controls className="w-full" playsInline>
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
  if (m.type === "image") {
    return (
      <div className="rounded-xl overflow-hidden border border-[var(--card-border)]">
        <img src={m.url} alt={m.name ?? "Media"} className="w-full max-h-[60vh] object-contain" />
      </div>
    );
  }
  const isMd = m.name?.toLowerCase().endsWith(".md");
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--card-border)] bg-zinc-900/50 min-h-[400px]">
      <div className="flex items-center gap-2 p-2 border-b border-[var(--card-border)]">
        <a
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-white/10"
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
        <a href={m.url} download className="p-2 rounded-lg hover:bg-white/10" title="Download">
          <Download className="h-4 w-4" />
        </a>
        <span className="text-sm text-[var(--muted-foreground)] truncate">{m.name ?? "Document"}</span>
      </div>
      <iframe
        src={isMd ? m.url : getDocViewerUrl(m.url)}
        title={m.name ?? "Document"}
        className="w-full h-[60vh] min-h-[400px]"
        sandbox={isMd ? "allow-same-origin" : undefined}
      />
    </div>
  );
}

export function LabModal({ lab, onClose }: Props) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (lab) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [lab, onClose]);

  const media = lab?.media ?? [];

  return (
    <AnimatePresence>
      {lab && (
        <motion.div
          key="lab-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-3xl overflow-hidden glass border border-[var(--card-border)] shadow-2xl my-8"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--card-border)]">
              <h3 className="text-xl font-semibold text-foreground truncate pr-4">{lab.title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-[var(--muted-foreground)] hover:text-foreground flex-shrink-0"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6 max-h-[80vh]">
              <p className="text-[var(--muted-foreground)] mb-6 leading-relaxed">{lab.description}</p>

              {lab.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {lab.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-[var(--accent-muted)] text-[var(--accent)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {media.length > 0 ? (
                <div className="space-y-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
                    Media & Documents
                  </h4>
                  {media.map((m, i) => (
                    <MediaItem key={i} m={m} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-[var(--card-border)] p-12 text-center text-[var(--muted-foreground)] mb-6">
                  No media or documents for this project.
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4">
                {lab.githubUrl && (
                  <a
                    href={lab.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                {lab.liveUrl && (
                  <a
                    href={lab.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg glass border border-[var(--card-border)] hover:border-[var(--accent)]/50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Site
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface Props {
  lab: LabProject | null;
  onClose: () => void;
}
