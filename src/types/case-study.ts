export type DocumentType = "pdf" | "docx" | "doc" | "pptx" | "xls" | "xlsx" | "video" | "image" | "md";

export interface CaseStudyDocument {
  url: string;
  type: DocumentType;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  useCase: string;
  documents: CaseStudyDocument[];
  imageUrl?: string;
  order: number;
}
