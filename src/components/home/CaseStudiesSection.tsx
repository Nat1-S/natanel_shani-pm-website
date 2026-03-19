"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, ChevronRight, ChevronLeft } from "lucide-react";
import { getCaseStudies } from "@/lib/supabase/case-studies";
import { mockCaseStudies } from "@/data/mock-case-studies";
import { DocumentViewerModal } from "@/components/ui/DocumentViewerModal";
import { useInView } from "@/hooks/useInView";
import { getCached, setCache } from "@/lib/cache";
import type { CaseStudy } from "@/types/case-study";

const CACHE_KEY = "caseStudies";
const VISIBLE_COUNT = 3;

export function CaseStudiesSection() {
  const { ref, inView } = useInView();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(
    () => getCached<CaseStudy[]>(CACHE_KEY) ?? mockCaseStudies
  );
  const [selected, setSelected] = useState<CaseStudy | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!inView) return;
    getCaseStudies().then((data) => {
      setCaseStudies(data);
      setCache(CACHE_KEY, data);
    });
  }, [inView]);

  const totalPages = caseStudies
    ? Math.max(1, Math.ceil(caseStudies.length / VISIBLE_COUNT))
    : 1;
  const canGoNext = page < totalPages - 1;
  const canGoPrev = page > 0;
  const visibleStudies =
    caseStudies?.slice(page * VISIBLE_COUNT, page * VISIBLE_COUNT + VISIBLE_COUNT) ?? [];

  const isLoading = false;

  return (
    <section id="case-studies" ref={ref} className="pt-24 pb-12 scroll-mt-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
        Product Case Studies
      </h2>

      {caseStudies?.length === 0 && (
        <div className="glass rounded-2xl border border-[var(--card-border)] p-16 text-center">
          <FolderOpen className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
          <p className="text-[var(--muted-foreground)]">No case studies yet.</p>
        </div>
      )}

      {caseStudies && caseStudies.length > 0 && (
        <motion.div
          initial={false}
          className="relative flex items-center gap-4"
        >
          {canGoPrev && (
            <button
              onClick={() => setPage((p) => p - 1)}
              className="absolute -left-2 sm:left-0 z-10 p-2 rounded-full glass border border-[var(--card-border)] hover:border-[var(--accent)]/50 transition-colors text-foreground"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
            <AnimatePresence mode="wait">
              {visibleStudies.map((cs) => (
                <motion.div
                  key={cs.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelected(cs)}
                  className="glass rounded-2xl border border-[var(--card-border)] p-6 cursor-pointer transition-colors hover:border-[var(--accent)]/30 group min-h-[220px] flex flex-col"
                >
                  {cs.imageUrl ? (
                    <div className="w-full h-36 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden grid place-items-center">
                      <img
                        src={cs.imageUrl}
                        alt={cs.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : null}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-[var(--accent)] transition-colors text-left">
                    {cs.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-3 text-left flex-1">
                    {cs.description}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {canGoNext && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="absolute -right-2 sm:right-0 z-10 p-2 rounded-full glass border border-[var(--card-border)] hover:border-[var(--accent)]/50 transition-colors text-foreground"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </motion.div>
      )}

      {caseStudies && caseStudies.length > 0 && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === page ? "bg-[var(--accent)]" : "bg-[var(--muted)]"
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}

      <DocumentViewerModal
        caseStudy={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
