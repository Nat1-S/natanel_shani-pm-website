import type { LabProject } from "@/types/lab-project";

export const mockLabs: LabProject[] = [
  {
    id: "1",
    title: "AI PM Assistant",
    description: "Internal tool for drafting PRDs and user stories with LLM assistance.",
    githubUrl: "https://github.com",
    liveUrl: "",
    tags: ["Next.js", "OpenAI", "RAG"],
    order: 1,
  },
];
