"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  X,
  FileText,
  Presentation,
  ExternalLink,
  Play,
  ArrowLeft,
} from "lucide-react";
import type { Project } from "@/types/project";

interface Props {
  project: Project;
}

function VideoPlayer({ url }: { url: string }) {
  const isYouTube =
    url.includes("youtube.com") || url.includes("youtu.be");
  const isLoom = url.includes("loom.com");

  if (isYouTube) {
    const videoId =
      url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1] ?? "";
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Project video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  if (isLoom) {
    const embedUrl = url.replace("/share/", "/embed/");
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900">
        <iframe
          src={embedUrl}
          title="Project video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900">
      <video
        src={url}
        controls
        className="w-full h-full"
        poster=""
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export function ProjectOnePager({ project }: Props) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
          <button
            onClick={() => router.back()}
            className="glass rounded-full p-2 text-[var(--muted-foreground)] hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="glass rounded-2xl border border-[var(--card-border)] overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {project.title}
            </h1>
            <p className="text-[var(--muted-foreground)] mb-6">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-[var(--accent-muted)] text-[var(--accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* One-Pager Summary */}
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="glass rounded-xl p-5 border border-[var(--card-border)]">
                <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">
                  Problem
                </h3>
                <p className="text-sm text-foreground">{project.problem}</p>
              </div>
              <div className="glass rounded-xl p-5 border border-[var(--card-border)]">
                <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">
                  Solution
                </h3>
                <p className="text-sm text-foreground">{project.solution}</p>
              </div>
              <div className="glass rounded-xl p-5 border border-[var(--card-border)]">
                <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">
                  Impact
                </h3>
                <p className="text-sm text-foreground">{project.impact}</p>
              </div>
            </div>

            {/* Video */}
            {project.videoUrl && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Play className="h-5 w-5 text-[var(--accent)]" />
                  Prototype / Demo
                </h3>
                <VideoPlayer url={project.videoUrl} />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {project.prdUrl && (
                <a
                  href={project.prdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                >
                  <FileText className="h-4 w-4" />
                  Download PRD
                </a>
              )}
              {project.strategyUrl && (
                <a
                  href={project.strategyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg glass border border-[var(--card-border)] hover:border-[var(--accent)]/50 transition-colors"
                >
                  <Presentation className="h-4 w-4" />
                  View Strategy (PPTX)
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg glass border border-[var(--card-border)] hover:border-[var(--accent)]/50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Link
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
