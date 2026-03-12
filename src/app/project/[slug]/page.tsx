import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/supabase/projects";
import { ProjectOnePager } from "@/components/project/ProjectOnePager";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return <ProjectOnePager project={project} />;
}
