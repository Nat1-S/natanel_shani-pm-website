export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  thumbnailUrl: string;
  problem: string;
  solution: string;
  impact: string;
  videoUrl: string;
  prdUrl: string;
  strategyUrl: string;
  liveLink: string;
  order: number;
  featured: boolean;
}
