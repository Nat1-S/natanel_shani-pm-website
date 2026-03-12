"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";
import { getAbout, ABOUT_DEFAULT } from "@/lib/supabase/about";
import { getCached, setCache } from "@/lib/cache";
import type { AboutContent } from "@/types/about";

const CACHE_KEY = "about";

export function AboutSection() {
  const [content, setContent] = useState<AboutContent>(
    () => getCached<AboutContent>(CACHE_KEY) ?? ABOUT_DEFAULT
  );

  useEffect(() => {
    const cached = getCached<AboutContent>(CACHE_KEY);
    if (cached) return;
    getAbout().then((data) => {
      setContent(data);
      setCache(CACHE_KEY, data);
    });
  }, []);

  return (
    <motion.section
      id="about"
      initial={false}
      className="glass rounded-3xl border border-[var(--card-border)] p-8 sm:p-10 lg:p-12 mb-24 scroll-mt-20"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-10">
        About
      </h2>

      <div className="space-y-8 text-[var(--muted-foreground)] leading-relaxed max-w-3xl">
        <div>
          <p className="text-lg text-foreground mb-4">{content.greeting}</p>
          <p className="mb-6">{content.intro}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)] mb-3">
            {content.journeyTitle}
          </h3>
          <p>{content.journey}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)] mb-3">
            {content.educationTitle}
          </h3>
          <p>{content.education}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)] mb-3">
            {content.reachOutTitle}
          </h3>
          <p className="mb-4">{content.reachOut}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`mailto:${content.email}`}
              className="inline-flex items-center gap-2 text-foreground hover:text-[var(--accent)] transition-colors"
            >
              <Mail className="h-4 w-4" />
              {content.email}
            </a>
            <a
              href={content.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground hover:text-[var(--accent)] transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              {content.linkedinUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
