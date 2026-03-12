"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, ChevronRight, ChevronLeft } from "lucide-react";
import { getLabs } from "@/lib/supabase/labs";
import { mockLabs } from "@/data/mock-labs";
import { LabModal } from "@/components/ui/LabModal";
import { useInView } from "@/hooks/useInView";
import { getCached, setCache } from "@/lib/cache";
import type { LabProject } from "@/types/lab-project";

const CACHE_KEY = "labs";
const VISIBLE_COUNT = 3;

function LabCard({
  lab,
  onClick,
}: {
  lab: LabProject;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="glass rounded-2xl border border-[var(--card-border)] p-6 cursor-pointer transition-colors hover:border-[var(--accent)]/30 group"
    >
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-[var(--accent)] transition-colors">
        {lab.title}
      </h3>
      <p className="text-sm text-[var(--muted-foreground)] line-clamp-3 mb-4">
        {lab.description}
      </p>
      {lab.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
    </motion.div>
  );
}

export function LabsSection() {
  const { ref, inView } = useInView();
  const [labs, setLabs] = useState<LabProject[]>(
    () => getCached<LabProject[]>(CACHE_KEY) ?? mockLabs
  );
  const [selected, setSelected] = useState<LabProject | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!inView) return;
    getLabs().then((data: LabProject[]) => {
      setLabs(data);
      setCache(CACHE_KEY, data);
    });
  }, [inView]);

  const totalPages = labs ? Math.max(1, Math.ceil(labs.length / VISIBLE_COUNT)) : 1;
  const canGoNext = page < totalPages - 1;
  const canGoPrev = page > 0;
  const visibleLabs = labs?.slice(page * VISIBLE_COUNT, page * VISIBLE_COUNT + VISIBLE_COUNT) ?? [];

  return (
    <section id="labs" ref={ref} className="py-24 scroll-mt-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
        Labs & Side Projects
      </h2>

      {labs?.length === 0 && (
        <div className="glass rounded-2xl border border-[var(--card-border)] p-16 text-center">
          <FolderOpen className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
          <p className="text-[var(--muted-foreground)]">No labs yet.</p>
        </div>
      )}

      {labs && labs.length > 0 && (
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
              {visibleLabs.map((lab) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <LabCard lab={lab} onClick={() => setSelected(lab)} />
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

      {labs && labs.length > 0 && totalPages > 1 && (
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

      <LabModal lab={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
