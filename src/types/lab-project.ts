export interface LabMedia {
  url: string;
  type: "video" | "image" | "document";
  name?: string;
}

export interface LabProject {
  id: string;
  title: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  media?: LabMedia[];
  tags: string[];
  order: number;
}
