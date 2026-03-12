"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Layers } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const base = isHome ? "" : "/";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
        >
          <Layers className="h-5 w-5 text-[var(--accent)]" />
          <span className="font-semibold tracking-tight">NS</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href={`${base}#about`}
            className="hidden sm:block text-sm text-[var(--muted-foreground)] hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href={`${base}#case-studies`}
            className="hidden sm:block text-sm text-[var(--muted-foreground)] hover:text-foreground transition-colors"
          >
            Case Studies
          </Link>
          <Link
            href={`${base}#labs`}
            className="hidden sm:block text-sm text-[var(--muted-foreground)] hover:text-foreground transition-colors"
          >
            Labs
          </Link>
          <Link
            href="/admin"
            className="text-sm text-[var(--muted-foreground)] hover:text-foreground transition-colors"
          >
            Admin
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
