"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import type { CaseStudy, CaseStudyDocument } from "@/types/case-study";

interface Props {
  caseStudy: CaseStudy | null;
  onClose: () => void;
}

function getViewerUrl(url: string, type: string): string {
  if (!url) return "";
  if (type === "pdf") return url;
  if (["docx", "doc", "pptx", "xls", "xlsx"].includes(type)) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }
  return "";
}

function docLabel(doc: CaseStudyDocument, idx: number): string {
  const labels: Record<string, string> = {
    pdf: "מסמך",
    docx: "מסמך Word",
    doc: "מסמך Word",
    pptx: "מצגת",
    xls: "גיליון",
    xlsx: "גיליון",
    video: "סרטון",
    image: "תמונה",
    md: "Markdown",
  };
  return labels[doc.type] || doc.type.toUpperCase();
}

export function DocumentViewerModal({ caseStudy, onClose }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const docs = caseStudy?.documents ?? [];
  const activeDoc = docs[activeIdx] ?? null;

  useEffect(() => {
    setActiveIdx(0);
  }, [caseStudy?.id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (caseStudy) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [caseStudy, onClose]);

  const hasDocument = !!activeDoc?.url;
  const isVideo = activeDoc?.type === "video";
  const isImage = activeDoc?.type === "image";
  const isMd = activeDoc?.type === "md";
  const viewerUrl = activeDoc && !isVideo && !isImage && !isMd
    ? getViewerUrl(activeDoc.url, activeDoc.type)
    : "";

  return (
    <AnimatePresence>
      {caseStudy && (
        <motion.div
          key="document-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden glass border border-[var(--card-border)] shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--card-border)] flex-shrink-0">
              <h3 className="text-lg font-semibold text-foreground truncate pr-4">
                {caseStudy.title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {docs.length > 1 && (
                  <div className="flex gap-1 mr-2">
                    {docs.map((doc, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIdx(i)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          i === activeIdx
                            ? "bg-[var(--accent)] text-white"
                            : "bg-white/10 text-[var(--muted-foreground)] hover:text-foreground"
                        }`}
                      >
                        {docLabel(doc, i)}
                      </button>
                    ))}
                  </div>
                )}
                {hasDocument && activeDoc && (
                  <>
                    <a
                      href={activeDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[var(--muted-foreground)] hover:text-foreground"
                      title="פתח בלשונית חדשה"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                      href={activeDoc.url}
                      download
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[var(--muted-foreground)] hover:text-foreground"
                      title="הורד"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[var(--muted-foreground)] hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6">
              {caseStudy.useCase && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)] mb-2">
                    Use Case
                  </h4>
                  <div className="text-[var(--muted-foreground)] leading-relaxed [&>p]:mb-2 last:[&>p]:mb-0 [&>strong]:font-semibold [&>strong]:text-foreground [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>li]:mb-1">
                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                      {caseStudy.useCase}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {hasDocument && activeDoc ? (
                isVideo ? (
                  <div className="rounded-xl overflow-hidden border border-[var(--card-border)] bg-zinc-900/50">
                    <video
                      src={activeDoc.url}
                      controls
                      className="w-full"
                      playsInline
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : isImage ? (
                  <div className="rounded-xl overflow-hidden border border-[var(--card-border)]">
                    <img
                      src={activeDoc.url}
                      alt={caseStudy.title}
                      className="w-full max-h-[60vh] object-contain"
                    />
                  </div>
                ) : isMd ? (
                  <div className="rounded-xl overflow-hidden border border-[var(--card-border)] bg-zinc-900/50 min-h-[400px]">
                    <iframe
                      src={activeDoc.url}
                      title={caseStudy.title}
                      className="w-full h-[60vh] min-h-[400px]"
                      sandbox="allow-same-origin"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden border border-[var(--card-border)] bg-zinc-900/50 min-h-[400px]">
                    <iframe
                      src={viewerUrl}
                      title={caseStudy.title}
                      className="w-full h-[60vh] min-h-[400px]"
                    />
                  </div>
                )
              ) : (
                <div className="rounded-xl border border-[var(--card-border)] p-12 text-center text-[var(--muted-foreground)]">
                  No document available for this case study.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
