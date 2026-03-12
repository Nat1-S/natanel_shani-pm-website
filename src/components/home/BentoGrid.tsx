"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FolderOpen, Loader2 } from "lucide-react";
import { getProjects } from "@/lib/supabase/projects";
import type { Project } from "@/types/project";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const spanClass =
    index === 0 ? "md:col-span-2 md:row-span-2" : index === 1 ? "md:col-span-2" : "";

  return (
    <motion.div
      variants={itemVariants}
      className={`group relative overflow-hidden rounded-2xl glass border border-[var(--card-border)] p-6 transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-[var(--accent)]/5 ${spanClass}`}
      whileHover={{ y: -4 }}
    >
      <Link href={`/project/${project.slug}`} className="block h-full">
        <div className="flex flex-col h-full min-h-[180px] sm:min-h-[220px]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <FolderOpen className="h-8 w-8 text-[var(--accent)] flex-shrink-0" />
            <ArrowRight className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-[var(--accent)] transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-[var(--muted-foreground)] flex-1 line-clamp-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md bg-[var(--accent-muted)] text-[var(--accent)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full text-center py-16 px-6 glass rounded-2xl border border-[var(--card-border)]"
    >
      <FolderOpen className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
      <p className="text-[var(--muted-foreground)]">No projects yet.</p>
      <p className="text-sm text-[var(--muted)] mt-1">
        Add projects to Firestore to see them here.
      </p>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-24 gap-4"
    >
      <Loader2 className="h-10 w-10 text-[var(--accent)] animate-spin" />
      <p className="text-[var(--muted-foreground)]">Loading projects…</p>
    </motion.div>
  );
}

export function BentoGrid() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  if (projects === null) return <LoadingState />;
  if (projects.length === 0) return <EmptyState />;

  return (
    <motion.section
      id="projects"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6"
    >
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </motion.section>
  );
}
