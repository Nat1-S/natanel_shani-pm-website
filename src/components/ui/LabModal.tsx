"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Download } from "lucide-react";
import type { LabProject, LabMedia } from "@/types/lab-project";

function getDocViewerUrl(url: string): string {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
}

function getOfficeViewerTabUrl(url: string): string {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
}

function isPdfMedia(m: LabMedia): boolean {
  const ref = (m.name ?? m.url).split("?")[0].toLowerCase();
  return ref.endsWith(".pdf");
}

function isMdMedia(m: LabMedia): boolean {
  return (m.name ?? "").toLowerCase().endsWith(".md");
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
  const isMd = isMdMedia(m);
  const isPdf = isPdfMedia(m);
  const iframeSrc = isMd ? m.url : isPdf ? m.url : getDocViewerUrl(m.url);

  return (
    <>
      <div className="hidden min-h-[400px] flex-col overflow-hidden rounded-xl border border-[var(--card-border)] bg-zinc-900/50 md:flex">
        <div className="flex items-center gap-2 border-b border-[var(--card-border)] p-2">
          <a
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 hover:bg-white/10"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <a href={m.url} download className="rounded-lg p-2 hover:bg-white/10" title="Download">
            <Download className="h-4 w-4" />
          </a>
          <span className="truncate text-sm text-[var(--muted-foreground)]">{m.name ?? "Document"}</span>
        </div>
        <iframe
          src={iframeSrc}
          title={m.name ?? "Document"}
          className="h-[60vh] min-h-[400px] w-full"
          sandbox={isMd ? "allow-same-origin" : undefined}
        />
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {isMd ? (
          <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm dark:bg-zinc-950">
            <iframe
              src={m.url}
              title={m.name ?? "Document"}
              sandbox="allow-same-origin"
              className="block h-[min(92dvh,900px)] w-full min-h-[72dvh] border-0"
            />
          </div>
        ) : isPdf ? (
          <>
            <a
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[var(--accent)] px-4 py-3 text-center text-sm font-medium text-white"
            >
              Open PDF in full screen
            </a>
            <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-white shadow-sm dark:bg-zinc-950">
              <iframe
                src={m.url}
                title={m.name ?? "Document"}
                className="block h-[min(92dvh,900px)] w-full min-h-[72dvh] border-0"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-white p-6 text-center shadow-sm dark:bg-zinc-950">
            <p className="text-sm text-[var(--muted-foreground)]">
              For a better mobile view, open the document in your browser (full screen).
            </p>
            <a
              href={getOfficeViewerTabUrl(m.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white"
            >
              <ExternalLink className="h-4 w-4" />
              Open document
            </a>
            <a href={m.url} download className="text-sm text-[var(--accent)] underline">
              Download
            </a>
          </div>
        )}
      </div>
    </>
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
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-auto bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-8 w-full max-w-4xl overflow-hidden rounded-3xl border border-[var(--card-border)] glass shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--card-border)] p-4 sm:p-6">
              <h3 className="truncate pr-4 text-xl font-semibold text-foreground">{lab.title}</h3>
              <button
                onClick={onClose}
                className="flex-shrink-0 rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-white/10 hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[80vh] flex-1 overflow-auto p-4 sm:p-6">
              <p className="mb-6 leading-relaxed text-[var(--muted-foreground)]">{lab.description}</p>

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
