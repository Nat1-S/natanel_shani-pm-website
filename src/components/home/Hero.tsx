"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getAbout, HERO_DEFAULT } from "@/lib/supabase/about";
import { getCached, setCache } from "@/lib/cache";

const CACHE_KEY = "about";

export function Hero() {
  const [tagline, setTagline] = useState(HERO_DEFAULT.heroTagline);
  const [skills, setSkills] = useState<string[]>(HERO_DEFAULT.heroSkills);

  useEffect(() => {
    const cached = getCached<{ heroTagline?: string; heroSkills?: string[] }>(CACHE_KEY);
    if (cached) {
      if (cached.heroTagline !== undefined) setTagline(cached.heroTagline);
      if (cached.heroSkills !== undefined) setSkills(cached.heroSkills);
    }
    getAbout().then((data) => {
      if (data.heroTagline !== undefined) setTagline(data.heroTagline);
      if (data.heroSkills !== undefined) setSkills(data.heroSkills);
      setCache(CACHE_KEY, data);
    });
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden rounded-3xl px-4 sm:px-6 lg:px-8">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 gradient-mesh"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />
      <div className="animate-grid-pulse absolute inset-0 opacity-30" style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 50%)
        `,
      }} aria-hidden />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] mb-4 font-medium"
        >
          AI-Driven Product Manager
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4"
        >
          Natanel Shani
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Image
            src="/images/profile.png"
            alt="Natanel Shani"
            width={200}
            height={200}
            className="rounded-full object-cover object-[50%_20%] w-60 h-60 mx-auto border-2 border-[var(--accent)]/30 shadow-lg"
            priority
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-8 whitespace-pre-line"
        >
          {tagline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 text-sm text-[var(--muted-foreground)]"
        >
          {skills.map(
            (tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full glass text-foreground/80"
              >
                {tech}
              </span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
