import type { Project } from "@/types/project";

/**
 * Fallback mock projects when Firebase is not configured.
 * Used for development and graceful empty/loading states.
 */
export const mockProjects: Project[] = [
  {
    id: "1",
    slug: "competitor-agent",
    title: "Competitor Research Agent",
    description: "AI-powered agent that autonomously researches competitors and generates strategic insights.",
    tags: ["AI", "LLMs", "RAG", "Python"],
    thumbnailUrl: "",
    problem: "Manual competitor research is time-consuming and often outdated.",
    solution: "An AI agent that continuously monitors competitors and surfaces actionable insights.",
    impact: "Reduced research time by 80% and improved strategic decision quality.",
    videoUrl: "",
    prdUrl: "",
    strategyUrl: "",
    liveLink: "",
    order: 1,
    featured: true,
  },
  {
    id: "2",
    slug: "ai-pm-assistant",
    title: "AI PM Assistant",
    description: "Internal tool to streamline product workflows with intelligent automation.",
    tags: ["Next.js", "OpenAI", "Firestore"],
    thumbnailUrl: "",
    problem: "PMs spend too much time on repetitive documentation tasks.",
    solution: "An AI assistant that drafts PRDs, user stories, and sprint plans.",
    impact: "40% reduction in documentation overhead.",
    videoUrl: "",
    prdUrl: "",
    strategyUrl: "",
    liveLink: "",
    order: 2,
    featured: true,
  },
  {
    id: "3",
    slug: "product-analytics-dashboard",
    title: "Product Analytics Dashboard",
    description: "Real-time analytics platform with SQL-backed insights and LLM-powered recommendations.",
    tags: ["SQL", "Python", "Firecrawl", "Data Viz"],
    thumbnailUrl: "",
    problem: "Stakeholders need instant access to product metrics and insights.",
    solution: "A unified dashboard with automated reporting and natural language queries.",
    impact: "Self-serve analytics reduced support requests by 60%.",
    videoUrl: "",
    prdUrl: "",
    strategyUrl: "",
    liveLink: "",
    order: 3,
    featured: false,
  },
];
