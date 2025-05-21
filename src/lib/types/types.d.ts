export interface Project {
  name: string;
  description: string;
  url: string;
  repository: string;
  category: string;
  stars?: number;
  forks?: number;
  mainLanguage?: string;
  license?: string;
  lastUpdated?: string;
  metadata?: Array<{
    key: string;
    value: string;
    url?: string;
  }>;
}