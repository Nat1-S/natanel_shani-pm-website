"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { LogOut, FileText, FlaskConical, FolderOpen, User } from "lucide-react";
import { AdminCaseStudies } from "@/components/admin/AdminCaseStudies";
import { AdminLabs } from "@/components/admin/AdminLabs";
import { AdminAbout } from "@/components/admin/AdminAbout";

type Tab = "about" | "case-studies" | "labs";

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("about");

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "about", label: "About", icon: User },
    { id: "case-studies", label: "Case Studies", icon: FileText },
    { id: "labs", label: "Labs & Projects", icon: FlaskConical },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Edit site content
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-[var(--muted-foreground)] hover:text-foreground"
            >
              ← Back to site
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-[var(--card-border)] hover:border-red-500/50 text-sm"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                tab === id
                  ? "bg-[var(--accent)] text-white"
                  : "glass border border-[var(--card-border)] text-[var(--muted-foreground)] hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl border border-[var(--card-border)] p-6 sm:p-8">
          {tab === "about" && <AdminAbout />}
          {tab === "case-studies" && <AdminCaseStudies />}
          {tab === "labs" && <AdminLabs />}
        </div>
      </div>
    </div>
  );
}
