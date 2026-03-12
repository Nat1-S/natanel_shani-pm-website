import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Project not found
      </h1>
      <p className="text-[var(--muted-foreground)] mb-6 text-center">
        The project you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to portfolio
      </Link>
    </div>
  );
}
